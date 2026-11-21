import { createMcpHandler } from "@modelcontextprotocol/server";
import { buildMcpServer } from "@/lib/mcp-server";

// A public, read-only MCP endpoint. The SDK handler serves both protocol eras
// statelessly: 2026-07-28 requests natively, and 2025-era clients through a
// fresh server per request, with no sessions to keep. GET and DELETE get 405.
export const runtime = "nodejs";
// Every tool answers in milliseconds; nothing here should hold a function open.
export const maxDuration = 10;

// The default response mode answers with plain JSON unless a tool streams
// progress, and these tools never do.
const handler = createMcpHandler(() => buildMcpServer(), {
  maxRequestBodySize: 64 * 1024,
});

// The spec asks servers to rate-limit tool calls. Per-instance and generous:
// these tools are cheap, the limit only stops a runaway loop.
const RATE_LIMIT = 120;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > RATE_LIMIT;
}

// No cookies, no credentials, nothing private behind it, so any origin may
// call it, including MCP clients that run in a browser.
const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, MCP-Protocol-Version, Mcp-Method, Mcp-Name, Mcp-Session-Id, Last-Event-ID",
  "Access-Control-Max-Age": "86400",
};

function withCors(res: Response): Response {
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(CORS)) headers.set(k, v);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

async function serve(req: Request): Promise<Response> {
  // These tools have nothing to subscribe to, and a subscription stream would
  // hold a function open for as long as a client liked. The 2026 revision names
  // the method in a header the SDK checks against the body, so this is enough.
  if (req.headers.get("mcp-method") === "subscriptions/listen") {
    return withCors(
      Response.json(
        { jsonrpc: "2.0", id: null, error: { code: -32601, message: "Method not found: this server offers no subscriptions." } },
        { status: 404 },
      ),
    );
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return withCors(
      Response.json(
        { jsonrpc: "2.0", id: null, error: { code: -32603, message: "Too many requests. Try again in a minute." } },
        { status: 429, headers: { "Retry-After": "60" } },
      ),
    );
  }
  return withCors(await handler.fetch(req));
}

export const POST = serve;
export const GET = serve;
export const DELETE = serve;

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
