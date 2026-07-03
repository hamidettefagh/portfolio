// Presentational architecture flow. A row of labeled boxes joined by arrows,
// horizontal on desktop, vertical on phones. No hooks, so it renders in both
// server and client components. Uses the brand's only two glyphs (arrows).
export function ArchitectureDiagram({
  stages,
}: {
  stages: { label: string; accent?: boolean }[];
}) {
  return (
    <div className="overflow-x-auto">
      <div className="flex items-stretch gap-2 [@media(max-width:640px)]:flex-col [@media(max-width:640px)]:items-center">
        {stages.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-2 [@media(max-width:640px)]:flex-col"
          >
            <div
              className={[
                "flex items-center justify-center text-center text-small leading-tight whitespace-nowrap border rounded-sm px-4 py-[10px]",
                s.accent
                  ? "border-accent-500 text-accent-700 bg-accent-050 font-medium"
                  : "border-line-2 text-ink-700 bg-paper-0",
              ].join(" ")}
            >
              {s.label}
            </div>
            {i < stages.length - 1 ? (
              <span
                className="text-ink-300 text-[18px] leading-none inline-block [@media(max-width:640px)]:rotate-90"
                aria-hidden="true"
              >
                &rarr;
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
