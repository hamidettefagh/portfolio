// The house style forbids em dashes and exclamation points. The ask widget's
// system prompt asks the model for that, but an instruction is a preference,
// not a guarantee, so the rule is enforced here, after the model has answered.

// An exclamation point at the end of a word: before a space, a closing quote
// or bracket, or the end of the text. "!=" and the like are left alone.
const BANG = /!+(?=[\s"'”’)\]]|$)/g;

export function houseStyle(text: string): string {
  return text
    .replace(/\s*—\s*/g, ", ")
    .replace(/\s+–\s+/g, ", ")
    .replace(BANG, ".")
    .replace(/,\s*([.,;:])/g, "$1")
    .replace(/^,\s*/, "")
    .trim();
}

// How many house-style breaks the raw model output had before the filter ran.
// Reported in the answer's trace, so the gap between what the prompt asked for
// and what the model did stays visible instead of silently patched.
export function countStyleBreaks(text: string): number {
  const dashes = text.match(/—|\s–\s/g)?.length ?? 0;
  const bangs = text.match(BANG)?.length ?? 0;
  return dashes + bangs;
}
