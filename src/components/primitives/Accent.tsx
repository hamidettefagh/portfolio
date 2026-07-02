// Serif accent word — components/primitives/Accent.jsx
export function Accent({
  underline = false,
  ink = false,
  children,
}: {
  underline?: boolean;
  ink?: boolean;
  children: React.ReactNode;
}) {
  return (
    <em
      className={[
        "font-serif italic font-medium tracking-[-0.01em]",
        ink ? "text-inherit" : "text-accent-600",
        underline
          ? "underline decoration-accent-500 decoration-[length:var(--underline-thickness-hero)] underline-offset-[0.12em]"
          : "",
      ].join(" ")}
    >
      {children}
    </em>
  );
}
