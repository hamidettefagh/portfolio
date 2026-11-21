// A compact, single-line version of the architecture flow. Every dimension is
// in em, so one font-size scales the whole thing in proportion: the intro can
// draw it large and hand it off to the small copy docked in the hero without
// the shapes disagreeing. No hooks; renders on the server or the client.
export function MiniFlow({
  stages,
  className = "",
  wrap = false,
}: {
  stages: { label: string; accent?: boolean }[];
  className?: string;
  wrap?: boolean;
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-[0.45em] leading-none",
        wrap ? "flex-wrap gap-y-[0.6em]" : "whitespace-nowrap",
        className,
      ].join(" ")}
    >
      {stages.map((s, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-[0.45em]"
          style={{ "--i": i } as React.CSSProperties}
        >
          <span
            className={[
              "inline-flex items-center border rounded-[0.42em] px-[0.72em] py-[0.52em] whitespace-nowrap",
              s.accent
                ? "border-accent-500 text-accent-700 bg-accent-050 font-medium"
                : "border-line-2 text-ink-700 bg-paper-0",
            ].join(" ")}
          >
            {s.label}
          </span>
          {i < stages.length - 1 ? (
            <span className="text-ink-300 text-[1.1em]" aria-hidden="true">
              &rarr;
            </span>
          ) : null}
        </span>
      ))}
    </span>
  );
}
