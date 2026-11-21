import { SourceTag, type SourceKind } from "@/components/receipts/Receipts";

// Labeled hairline rule — components/primitives/Rule.jsx
// `source` says how the section below is made; it only shows in receipts mode.
export function Rule({
  label,
  strong = false,
  source,
}: {
  label?: string;
  strong?: boolean;
  source?: SourceKind;
}) {
  return (
    <div className="flex items-center gap-4" role="separator">
      {label ? (
        <span className="font-mono text-mono tracking-mono uppercase text-accent-600 flex-none">
          {label}
        </span>
      ) : null}
      <span
        className={[
          "flex-1 h-0 border-t",
          strong ? "border-line-2" : "border-line-1",
        ].join(" ")}
      ></span>
      {/* Hidden tags are display:none, so they take no gap when the mode is off. */}
      {source ? <SourceTag kind={source} /> : null}
    </div>
  );
}
