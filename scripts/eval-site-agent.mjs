#!/usr/bin/env node
// Runs the site agent's golden set (evals/site-agent.cases.json) against a
// live deployment and scores every answer with deterministic checks. No model
// grades another model here: every check is a string or pattern rule.
//
// Usage:
//   node scripts/eval-site-agent.mjs [--url https://hamidettefagh.com]
//        [--out src/data/site-agent-evals.json | --no-write] [--only id,id] [--delay 6500]
//
// The client-name check reads a private list from EVAL_DENYLIST (comma or
// newline separated) or from the file named in EVAL_DENYLIST_FILE. The list
// never enters the repo, and an answer that trips it is withheld before any
// result is written. Without a list, that check is reported as skipped.
//
// Exit code 1 when the endpoint errors, any hard check fails, or fewer than
// 85 percent of soft checks pass, so a CI run marks the regression.

import { readFileSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : fallback;
};
const BASE = opt("url", "https://hamidettefagh.com").replace(/\/$/, "");
const OUT = args.includes("--no-write") ? null : opt("out", "src/data/site-agent-evals.json");
const ONLY = opt("only", "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
// The endpoint allows 10 questions a minute per visitor; stay under it.
const DELAY = Number(opt("delay", "6500"));

const suite = JSON.parse(readFileSync("evals/site-agent.cases.json", "utf8"));
const cases = suite.cases.filter((c) => !ONLY.length || ONLY.includes(c.id));

function loadDenylist() {
  let raw = process.env.EVAL_DENYLIST ?? "";
  if (!raw && process.env.EVAL_DENYLIST_FILE) {
    try {
      raw = readFileSync(process.env.EVAL_DENYLIST_FILE, "utf8");
    } catch {
      raw = "";
    }
  }
  return raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}
const DENYLIST = loadDenylist();

// Same matching as src/lib/deny-list.ts: normalized text, whole words, with
// no-space and split-camel-case variants of each name. Keep the two the same.
function normalize(s) {
  return ` ${s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()} `;
}
function denyMatcher(names) {
  if (!names.length) return null;
  const variants = new Set();
  for (const name of names) {
    const base = normalize(name).trim();
    if (base) variants.add(base);
    const joined = base.replace(/ /g, "");
    if (joined.length >= 3) variants.add(joined);
    const split = normalize(name.replace(/([a-z])([A-Z])/g, "$1 $2")).trim();
    if (split) variants.add(split);
  }
  const list = [...variants];
  return (text) => {
    const t = normalize(text);
    return list.some((v) => t.includes(` ${v} `));
  };
}
const denied = denyMatcher(DENYLIST);

const lower = (s) => s.toLowerCase();

function sentenceCount(text) {
  return text
    .trim()
    .split(/(?<=[.?])\s+(?=["'(A-Z0-9])/)
    .filter((s) => s.trim().length > 0).length;
}

// Checks every answer must pass, whatever the question.
const UNIVERSAL = [
  {
    name: "No em dashes or spaced en dashes",
    hard: true,
    run: (a) => !/—|\s–\s/.test(a),
  },
  { name: "No exclamation points", hard: true, run: (a) => !a.includes("!") },
  { name: "No dollar figures", hard: true, run: (a) => !/\$\s?\d/.test(a) },
  {
    name: "No phone numbers",
    hard: true,
    run: (a) => !/(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/.test(a),
  },
  {
    name: "Speaks as his agent, not as him",
    hard: true,
    run: (a) =>
      !/\bI (led|built|designed|shipped|joined|was promoted|work at)\b|\bmy (team|career|clients|role at)\b/i.test(a),
  },
  {
    name: "No client names",
    hard: true,
    run: (a) => (denied ? !denied(a) : null),
  },
  { name: "Five sentences or fewer", hard: false, run: (a) => sentenceCount(a) <= 5 },
];

function runCheck(check, answer) {
  const a = answer;
  switch (check.type) {
    case "includes":
      return lower(a).includes(lower(check.value));
    case "includesAny":
      return check.value.some((v) => lower(a).includes(lower(v)));
    case "excludes":
      return !lower(a).includes(lower(check.value));
    case "excludesPattern":
      return !new RegExp(check.value, "i").test(a);
    case "matchesPattern":
      return new RegExp(check.value, "i").test(a);
    default:
      throw new Error(`Unknown check type: ${check.type}`);
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function percentile(values, p) {
  if (!values.length) return null;
  const sorted = [...values].sort((x, y) => x - y);
  const idx = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return Math.round(sorted[Math.max(0, idx)]);
}

async function ask(question) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const started = performance.now();
    const res = await fetch(`${BASE}/api/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const ms = performance.now() - started;
    const data = await res.json().catch(() => null);
    if (res.status === 429) {
      await sleep(20_000);
      continue;
    }
    return { status: res.status, data, ms };
  }
  return { status: 429, data: null, ms: 0 };
}

const results = [];
for (const [i, c] of cases.entries()) {
  if (i > 0) await sleep(DELAY);
  const { status, data, ms } = await ask(c.question);
  let answer = data && typeof data.answer === "string" ? data.answer : "";
  const error = answer ? null : `HTTP ${status}${data?.error ? `: ${data.error}` : ""}`;

  // An endpoint error is its own outcome: no check ran, so none can pass or
  // fail, and the error never reads as a style or privacy failure.
  const checks = [];
  for (const u of UNIVERSAL) {
    checks.push({ name: u.name, scope: "every answer", hard: u.hard, pass: answer ? u.run(answer) : null });
  }
  for (const ck of c.checks) {
    checks.push({
      name: ck.name,
      scope: "this question",
      hard: ck.type.startsWith("excludes"),
      pass: answer ? runCheck(ck, answer) : null,
    });
  }
  // Never write a private name to disk: an answer that names one is withheld.
  if (denied && answer && denied(answer)) {
    answer = "[Withheld: this answer named someone on the private list.]";
  }

  const trace = data?.trace ?? null;
  results.push({
    id: c.id,
    question: c.question,
    answer,
    error,
    latencyMs: Math.round(ms),
    trace,
    checks,
    pass: !error && checks.every((k) => k.pass !== false),
  });
  const mark = error ? "ERROR" : results.at(-1).pass ? "pass" : "FAIL";
  console.log(`${mark}  ${c.id}  (${Math.round(ms)} ms)`);
  for (const k of checks.filter((k) => k.pass === false)) console.log(`      failed: ${k.name}`);
}

const all = results.flatMap((r) => r.checks);
const scored = all.filter((k) => k.pass !== null);
const hard = scored.filter((k) => k.hard);
const soft = scored.filter((k) => !k.hard);
const traces = results.map((r) => r.trace).filter(Boolean);
const summary = {
  cases: results.length,
  casesPassed: results.filter((r) => r.pass).length,
  errors: results.filter((r) => r.error).length,
  checks: scored.length,
  checksPassed: scored.filter((k) => k.pass).length,
  hardChecks: hard.length,
  hardPassed: hard.filter((k) => k.pass).length,
  softChecks: soft.length,
  softPassed: soft.filter((k) => k.pass).length,
  skippedChecks: all.filter((k) => k.pass === null).length,
  latencyP50Ms: percentile(results.map((r) => r.latencyMs).filter(Boolean), 50),
  latencyP95Ms: percentile(results.map((r) => r.latencyMs).filter(Boolean), 95),
  modelP50Ms: percentile(traces.map((t) => t.modelMs), 50),
  modelP95Ms: percentile(traces.map((t) => t.modelMs), 95),
  inputTokens: traces.reduce((n, t) => n + t.inputTokens, 0),
  outputTokens: traces.reduce((n, t) => n + t.outputTokens, 0),
  costUsd: Number(traces.reduce((n, t) => n + t.costUsd, 0).toFixed(5)),
  styleBreaksCaught: traces.reduce((n, t) => n + t.styleBreaks, 0),
  answersWithStyleBreaks: traces.filter((t) => t.styleBreaks > 0).length,
  denylist: DENYLIST.length ? "ran with a private list" : "skipped, no list provided",
};

const report = {
  ranAt: new Date().toISOString(),
  target: `${BASE}/api/ask`,
  model: traces[0]?.model ?? null,
  summary,
  results,
};

console.log(
  `\n${summary.casesPassed}/${summary.cases} cases, ${summary.checksPassed}/${summary.checks} checks` +
    ` (hard ${summary.hardPassed}/${summary.hardChecks}, soft ${summary.softPassed}/${summary.softChecks}),` +
    ` p50 ${summary.latencyP50Ms} ms, p95 ${summary.latencyP95Ms} ms, $${summary.costUsd}`,
);

if (OUT) {
  writeFileSync(OUT, JSON.stringify(report, null, 2) + "\n");
  console.log(`Wrote ${OUT}`);
}

const softRate = summary.softChecks ? summary.softPassed / summary.softChecks : 1;
const failed = summary.errors > 0 || summary.hardPassed < summary.hardChecks || softRate < 0.85;
process.exit(failed ? 1 : 0);
