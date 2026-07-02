import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { AGENT_SYSTEM } from "@/lib/agent-system";

export const runtime = "nodejs";

const MAX_QUESTION_LENGTH = 300;
const RATE_LIMIT = 10; // requests per window per IP
const RATE_WINDOW_MS = 60_000;

// Per-instance sliding window. Good enough for a personal site; swap in
// Upstash Ratelimit on Vercel KV for a shared limit across instances.
const hits = new Map<string, number[]>();

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
  // Same-origin check
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
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 400,
      system: AGENT_SYSTEM,
      messages: [{ role: "user", content: question.trim() }],
    });
    const answer = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");
    if (!answer.trim()) {
      // e.g. stop_reason "refusal" returns 200 with no text content
      return NextResponse.json(
        { error: "The agent hit an error. Try again, or email hamid.ettefagh@gmail.com." },
        { status: 502 },
      );
    }
    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json(
      { error: "The agent hit an error. Try again, or email hamid.ettefagh@gmail.com." },
      { status: 502 },
    );
  }
}
