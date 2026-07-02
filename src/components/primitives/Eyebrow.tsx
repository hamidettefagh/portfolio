import { Fragment } from "react";

// Mono meta eyebrow — components/primitives/Eyebrow.jsx
export function Eyebrow({
  dot,
  accent = false,
  children,
}: {
  dot?: "accent" | "live";
  accent?: boolean;
  children: React.ReactNode;
}) {
  const items = Array.isArray(children) ? children : [children];
  return (
    <span
      className={[
        "font-mono text-mono tracking-mono uppercase inline-flex items-center gap-[10px] font-normal",
        accent ? "text-accent-600" : "text-ink-500",
      ].join(" ")}
    >
      {dot ? (
        <span
          className={[
            "w-[7px] h-[7px] rounded-full flex-none",
            dot === "live" ? "bg-live" : "bg-accent-500",
          ].join(" ")}
          aria-hidden="true"
        ></span>
      ) : null}
      {items.map((c, i) => (
        <Fragment key={i}>
          {i > 0 ? (
            <span className="text-ink-300" aria-hidden="true">
              &middot;
            </span>
          ) : null}
          <span>{c}</span>
        </Fragment>
      ))}
    </span>
  );
}
