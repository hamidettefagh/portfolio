// Matching against a private list of names (client names) that must never
// appear in an answer. The list itself only ever comes from a secret.
//
// Text is normalized first (lowercase, every run of punctuation and spaces
// becomes one space) and names match on whole words, so "OpenTable",
// "Open Table", and "open-table" are the same, while a short name never
// matches inside a longer word. scripts/eval-site-agent.mjs carries a copy of
// this function; keep the two the same.

function normalize(s: string): string {
  return ` ${s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()} `;
}

export function denyMatcher(raw: string | undefined): ((text: string) => boolean) | null {
  const names = (raw ?? "")
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (!names.length) return null;
  const variants = new Set<string>();
  for (const name of names) {
    const base = normalize(name).trim();
    if (base) variants.add(base);
    const joined = base.replace(/ /g, "");
    if (joined.length >= 3) variants.add(joined);
    const split = normalize(name.replace(/([a-z])([A-Z])/g, "$1 $2")).trim();
    if (split) variants.add(split);
  }
  const list = [...variants];
  return (text: string) => {
    const t = normalize(text);
    return list.some((v) => t.includes(` ${v} `));
  };
}

// What the agent says instead, word for word the same whichever name tripped
// it, so the reply never confirms that a name is on the list. The list should
// also carry decoys (other airlines, platforms, carriers) for the same reason.
export const DENIED_ANSWER =
  "Hamid keeps client names private, so I can't name the companies behind his work. The case studies describe each one by its industry, like a major US airline or a global dining platform.";
