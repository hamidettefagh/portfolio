// NOW ticker strip — components/patterns/Ticker.jsx
export function Ticker({
  label = "Now",
  live = true,
  items = [],
}: {
  label?: string;
  live?: boolean;
  items?: string[];
}) {
  return (
    <div className="border-t border-b border-line-2 py-[14px] flex items-center gap-7 overflow-hidden">
      <span className="font-mono text-mono tracking-mono uppercase text-accent-600 flex-none inline-flex items-center gap-2">
        {live ? (
          <span
            className="w-[7px] h-[7px] rounded-full bg-live"
            aria-hidden="true"
          ></span>
        ) : null}
        {label}
      </span>
      <span className="flex gap-8 flex-wrap">
        {items.map((it, i) => (
          <span
            key={i}
            className="font-mono text-mono tracking-[0.04em] text-ink-700 whitespace-nowrap"
          >
            {it}
          </span>
        ))}
      </span>
    </div>
  );
}
