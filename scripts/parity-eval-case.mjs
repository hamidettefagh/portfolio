#!/usr/bin/env node
// Parity check: the site's eval case validator (src/lib/eval-case.ts) against
// the incident-to-eval skill's own validator (scripts/validate-eval.mjs).
// Builds a corpus of valid and broken cases, runs both, and requires the
// exact same error list, in the same order, for every case.
//
// Usage (Node 22.6 or later):
//   node --experimental-strip-types scripts/parity-eval-case.mjs [path-or-url-to-validate-eval.mjs]
// Default source: the public skill repo on GitHub, pinned to the commit the
// published result (429 cases, 0 mismatches) was measured against.

import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const SKILL_SRC =
  process.argv[2] ??
  "https://raw.githubusercontent.com/hamidettefagh/incident-to-eval/ada57de2cfb61d2c395c05327dced420254cb858/scripts/validate-eval.mjs";

async function loadSkillValidator() {
  const text = SKILL_SRC.startsWith("http")
    ? await (await fetch(SKILL_SRC)).text()
    : readFileSync(SKILL_SRC, "utf8");
  const cut = text.indexOf("// --- CLI ---");
  if (cut < 0) throw new Error("Could not find the CLI marker in the skill validator.");
  const dir = mkdtempSync(join(tmpdir(), "parity-"));
  const file = join(dir, "validate-eval.mjs");
  writeFileSync(file, text.slice(0, cut));
  return (await import(pathToFileURL(file).href)).validateCase;
}

const clone = (v) => JSON.parse(JSON.stringify(v));

function setPath(obj, path, value) {
  const keys = path.split(".");
  let o = obj;
  for (const k of keys.slice(0, -1)) {
    if (typeof o[k] !== "object" || o[k] === null) o[k] = {};
    o = o[k];
  }
  const last = keys.at(-1);
  if (value === undefined) delete o[last];
  else o[last] = value;
}

function corpus(base) {
  const out = [clone(base), "not an object", null, [], 42];
  const paths = [
    "id",
    "title",
    "sourceIncident",
    "sourceIncident.summary",
    "sourceIncident.severity",
    "sourceIncident.date",
    "sourceIncident.surface",
    "failure",
    "failure.category",
    "failure.mode",
    "failure.observed",
    "failure.expected",
    "case",
    "case.input",
    "case.context",
    "case.expected",
    "case.expected.behavior",
    "case.expected.assertions",
    "guard",
    "guard.runOn",
    "guard.suite",
    "notes",
  ];
  const bad = [
    undefined,
    "",
    "   ",
    null,
    0,
    true,
    [],
    {},
    "Not Kebab",
    "sev5",
    "2026-13",
    "2026-01-01",
    "every-change",
    "grounding",
    "kebab-ok",
  ];
  for (const p of paths) {
    for (const v of bad) {
      const c = clone(base);
      setPath(c, p, v);
      out.push(c);
    }
  }
  const assertionVariants = [
    [],
    [null],
    ["must-contain"],
    [{}],
    [{ type: "must-contain" }],
    [{ type: "must-contain", value: "" }],
    [{ type: "nope", value: "x" }],
    [{ type: "must-refuse", value: "x" }, { type: 7, value: 7 }],
    [[1, 2]],
    [{ type: "human-review", value: "Would a reviewer accept this answer?" }],
  ];
  for (const a of assertionVariants) {
    const c = clone(base);
    setPath(c, "case.expected.assertions", a);
    out.push(c);
  }
  // Pairs of breaks, so ordering of messages is exercised too.
  for (let i = 0; i < paths.length; i++) {
    for (let j = i + 1; j < paths.length; j += 3) {
      const c = clone(base);
      setPath(c, paths[i], "");
      setPath(c, paths[j], null);
      out.push(c);
    }
  }
  return out;
}

const skillValidate = await loadSkillValidator();
const { validateCase: siteValidate, WORKED_EXAMPLE } = await import(
  pathToFileURL(join(process.cwd(), "src/lib/eval-case.ts")).href
);

let checked = 0;
let mismatches = 0;
for (const c of corpus(WORKED_EXAMPLE)) {
  const a = JSON.stringify(skillValidate(c));
  const b = JSON.stringify(siteValidate(c));
  checked++;
  if (a !== b) {
    mismatches++;
    if (mismatches <= 5) console.error(`Mismatch:\n  skill: ${a}\n  site:  ${b}\n  case:  ${JSON.stringify(c).slice(0, 200)}`);
  }
}
console.log(`${checked} cases checked, ${mismatches} mismatches.`);
process.exit(mismatches ? 1 : 0);
