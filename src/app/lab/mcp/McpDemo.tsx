"use client";

import { useState } from "react";

// Sends real MCP requests to this site's endpoint, from your browser, and
// shows both sides of the exchange. It uses the stateless 2026-07-28 shape:
// no handshake, every request carries its own protocol version.

type Example = {
  label: string;
  method: "tools/list" | "tools/call";
  name?: string;
  args?: Record<string, unknown>;
};

const META = {
  "io.modelcontextprotocol/protocolVersion": "2026-07-28",
  "io.modelcontextprotocol/clientCapabilities": {},
};

export function McpDemo({ examples }: { examples: Example[] }) {
  const [active, setActive] = useState(0);
  const [busy, setBusy] = useState(false);
  const [exchange, setExchange] = useState<{ request: string; response: string; ms: number; status: number } | null>(
    null,
  );

  const ex = examples[active];
  const body = {
    jsonrpc: "2.0",
    id: 1,
    method: ex.method,
    params: ex.method === "tools/call" ? { name: ex.name, arguments: ex.args ?? {}, _meta: META } : { _meta: META },
  };

  const send = async () => {
    setBusy(true);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      "MCP-Protocol-Version": "2026-07-28",
      "Mcp-Method": ex.method,
    };
    if (ex.name) headers["Mcp-Name"] = ex.name;
    const started = performance.now();
    try {
      const res = await fetch("/api/mcp", { method: "POST", headers, body: JSON.stringify(body) });
      const text = await res.text();
      let pretty = text;
      try {
        const parsed = JSON.parse(text);
        // Show the structured result rather than its text mirror, to keep it short.
        if (parsed?.result?.structuredContent) {
          parsed.result.content = [{ type: "text", text: "(same JSON as structuredContent)" }];
        }
        pretty = JSON.stringify(parsed, null, 2);
      } catch {
        // Not JSON: show it as it came.
      }
      setExchange({
        request: `POST /api/mcp\n${Object.entries(headers)
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n")}\n\n${JSON.stringify(body, null, 2)}`,
        response: pretty,
        ms: performance.now() - started,
        status: res.status,
      });
    } catch {
      setExchange({ request: JSON.stringify(body, null, 2), response: "The request failed. Check your connection.", ms: 0, status: 0 });
    }
    setBusy(false);
  };

  const preCls =
    "m-0 px-5 py-4 font-mono text-[12px] leading-[1.6] text-ink-700 whitespace-pre-wrap break-words max-h-[420px] overflow-y-auto";

  return (
    <div className="bg-surface-raised border border-line-1 rounded-md overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 px-5 py-4 border-b border-line-1" role="group" aria-label="Example requests">
        {examples.map((e, i) => (
          <button
            key={e.label}
            type="button"
            aria-pressed={i === active}
            onClick={() => {
              setActive(i);
              setExchange(null);
            }}
            className={[
              "choice-chip text-[14px] leading-none rounded-pill border px-[13px] py-[8px] cursor-pointer",
              i === active
                ? "border-accent-500 text-accent-700 bg-accent-050"
                : "border-line-2 text-ink-700 bg-transparent hover:border-ink-500 hover:text-ink-900",
            ].join(" ")}
          >
            {e.label}
          </button>
        ))}
        <button
          type="button"
          onClick={send}
          disabled={busy}
          className="ml-auto font-body font-medium text-[15px] leading-none px-5 py-[10px] rounded-pill cursor-pointer whitespace-nowrap bg-accent-600 text-on-accent transition-[background-color,transform] duration-(--dur-fast) ease-out hover:bg-accent-700 active:translate-y-px disabled:opacity-45 [@media(max-width:560px)]:ml-0"
        >
          {busy ? "Sending" : "Send request"}
        </button>
      </div>
      <div className="grid grid-cols-2 [@media(max-width:820px)]:grid-cols-1">
        <div className="min-w-0 border-r border-line-1 [@media(max-width:820px)]:border-r-0 [@media(max-width:820px)]:border-b">
          <p className="m-0 px-5 pt-4 font-mono text-mono-sm tracking-[0.06em] uppercase text-ink-500">Request</p>
          <pre className={preCls}>{exchange ? exchange.request : JSON.stringify(body, null, 2)}</pre>
        </div>
        <div className="min-w-0" aria-live="polite">
          <p className="m-0 px-5 pt-4 font-mono text-mono-sm tracking-[0.06em] uppercase text-ink-500">
            Response
            {exchange && exchange.status ? (
              <span className="text-ink-300">
                {" "}
                &middot; HTTP {exchange.status} &middot; {Math.round(exchange.ms)} ms
              </span>
            ) : null}
          </p>
          <pre className={preCls}>
            {exchange ? exchange.response : "Send the request to see what the server returns."}
          </pre>
        </div>
      </div>
    </div>
  );
}
