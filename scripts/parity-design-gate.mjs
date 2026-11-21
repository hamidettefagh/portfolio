#!/usr/bin/env node
// Exhaustive parity: the site's design gate engine (src/lib/design-gate.ts)
// against the agent-or-workflow skill's own engine (scripts/decide.mjs), over
// every possible answer combination, under both lenses. Every field of every
// verdict must match.
//
// Usage (Node 22.6 or later):
//   node --experimental-strip-types scripts/parity-design-gate.mjs [path-or-url-to-decide.mjs]
// Default source: the public skill repo on GitHub.

import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const SKILL_SRC =
  process.argv[2] ??
  "https://raw.githubusercontent.com/hamidettefagh/agent-or-workflow/main/scripts/decide.mjs";

const text = SKILL_SRC.startsWith("http")
  ? await (await fetch(SKILL_SRC)).text()
  : readFileSync(SKILL_SRC, "utf8");
const cut = text.indexOf("// --- CLI ---");
if (cut < 0) throw new Error("Could not find the CLI marker in decide.mjs.");
const dir = mkdtempSync(join(tmpdir(), "parity-"));
const file = join(dir, "decide-engine.mjs");
writeFileSync(file, text.slice(0, cut) + "\nexport { compute as skillCompute };\n");

const skill = await import(pathToFileURL(file).href);
const site = await import(pathToFileURL(join(process.cwd(), "src/lib/design-gate.ts")).href);

const opts = Object.fromEntries(site.QUESTIONS.map((q) => [q.id, q.options.map((o) => o.id)]));
const ids = Object.keys(opts);
const FIELDS = ["shape", "shapeDetail", "knowledge", "humans", "model", "risks", "stages"];

function* combos(i = 0, acc = {}) {
  if (i === ids.length) {
    yield { ...acc };
    return;
  }
  for (const v of opts[ids[i]]) {
    acc[ids[i]] = v;
    yield* combos(i + 1, acc);
  }
}

let n = 0;
let bad = 0;
for (const a of combos()) {
  for (const lens of ["general", "agentforce"]) {
    n++;
    const x = skill.skillCompute(a, lens);
    const y = site.compute(a, lens);
    const diff = FIELDS.find((f) => JSON.stringify(x[f]) !== JSON.stringify(y[f]));
    if (diff) {
      bad++;
      if (bad <= 5) console.error(`Mismatch in ${diff} for ${JSON.stringify(a)} (${lens})`);
    }
  }
}
console.log(`${n} verdicts compared (${n / 2} answer sets, 2 lenses), ${bad} mismatches.`);
process.exit(bad ? 1 : 0);
