import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { AGENT_SYSTEM } from "@/lib/agent-system";
import { countStyleBreaks, houseStyle } from "@/lib/house-style";
import { ASK_MODEL, ASK_PRICE } from "@/lib/ask-trace";
import { DENIED_ANSWER, denyMatcher } from "@/lib/deny-list";

export const runtime = "nodejs";

const MAX_QUESTION_LENGTH = 300;
const RATE_LIMIT = 10; // requests per window per IP
const RATE_WINDOW_MS = 60_000;

// Per-instance sliding window. Good enough for a personal site; swap in
// Upstash Ratelimit on Vercel KV for a shared limit across instances.
const hits = new Map<string, number[]>();

// A live output check against names that must never appear, read from a
// server-only secret so the list never enters the public repo. With no
// secret set, the check is skipped and the trace says so.
const denied = denyMatcher(process.env.OUTPUT_DENYLIST);

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

export async function POST(req: NextRequest) {
  // Browsers on other sites are refused. Requests without an Origin header
  // (scripts, the eval runner) pass this check and meet the rate limit.
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "The agent is getting a lot of questions. Give it a minute and try again." },
      { status: 429 },
    );
  }

  let question: unknown;
  try {
    ({ question } = await req.json());
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  if (typeof question !== "string" || !question.trim()) {
    return NextResponse.json({ error: "Ask a question first." }, { status: 400 });
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return NextResponse.json(
      { error: "Keep questions under 300 characters." },
      { status: 400 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "The agent is offline right now. Email hamid.ettefagh@gmail.com instead." },
      { status: 500 },
    );
  }

  try {
    const client = new Anthropic();
    const started = Date.now();
    const response = await client.messages.create({
      model: ASK_MODEL,
      max_tokens: 400,
      system: AGENT_SYSTEM,
      messages: [{ role: "user", content: question.trim() }],
    });
    const modelMs = Date.now() - started;
    const raw = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");
    if (!raw.trim()) {
      // e.g. stop_reason "refusal" returns 200 with no text content
      return NextResponse.json(
        { error: "The agent hit an error. Try again, or email hamid.ettefagh@gmail.com." },
        { status: 502 },
      );
    }
    // A listed name gets the same ordinary reply as any question about
    // clients: same status, same words, so the reply never confirms a name.
    const answer = denied?.(raw) ? DENIED_ANSWER : raw;
    // What it took to produce this answer, shown under it on the page. No
    // question or answer text is stored anywhere; this travels back with the
    // response and nowhere else.
    const { input_tokens: inputTokens, output_tokens: outputTokens } = response.usage;
    return NextResponse.json({
      answer: houseStyle(answer),
      trace: {
        model: ASK_MODEL,
        modelMs,
        inputTokens,
        outputTokens,
        costUsd: (inputTokens * ASK_PRICE.input + outputTokens * ASK_PRICE.output) / 1_000_000,
        stopReason: response.stop_reason,
        styleBreaks: countStyleBreaks(answer),
        outputCheck: denied !== null,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "The agent hit an error. Try again, or email hamid.ettefagh@gmail.com." },
      { status: 502 },
    );
  }
}
