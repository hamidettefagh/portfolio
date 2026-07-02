// Labeled hairline rule — components/primitives/Rule.jsx
export function Rule({
  label,
  strong = false,
}: {
  label?: string;
  strong?: boolean;
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
    </div>
  );
}
