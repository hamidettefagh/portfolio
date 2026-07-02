// Mono pill tag — components/primitives/Tag.jsx
const VARIANTS = {
  outline: "border-line-1",
  fill: "bg-paper-1 border-transparent",
  accent: "text-accent-600 border-accent-100 bg-accent-050",
} as const;

export function Tag({
  variant = "outline",
  children,
}: {
  variant?: keyof typeof VARIANTS;
  children: React.ReactNode;
}) {
  return (
    <span
      className={[
        "inline-flex items-center font-mono text-mono-sm tracking-[0.06em] uppercase text-ink-700",
        "border rounded-pill px-[11px] py-[5px] leading-none whitespace-nowrap",
        VARIANTS[variant],
      ].join(" ")}
    >
      {children}
    </span>
  );
}
