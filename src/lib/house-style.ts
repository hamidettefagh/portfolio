// The house style forbids em dashes and exclamation points. The ask widget's
// system prompt asks the model for that, but an instruction is a preference,
// not a guarantee, so the rule is enforced here, after the model has answered.
export function houseStyle(text: string): string {
  return text
    .replace(/\s*\u2014\s*/g, ", ")
    .replace(/\s+\u2013\s+/g, ", ")
    .replace(/!+(?=(?:\s|$))/g, ".")
    .replace(/,\s*([.,;:])/g, "$1")
    .replace(/^,\s*/, "")
    .trim();
}
