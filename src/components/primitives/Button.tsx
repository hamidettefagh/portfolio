// Pill button — components/primitives/Button.jsx
const VARIANTS = {
  primary: "bg-accent-600 text-on-accent hover:bg-accent-700",
  secondary:
    "bg-transparent text-ink-900 border-line-2 hover:border-ink-900",
  ghost: "bg-transparent text-ink-900 hover:text-accent-700",
} as const;

const SIZES = {
  md: "text-[16px] py-[14px]",
  sm: "text-[14px] py-[10px]",
} as const;

// Ghost buttons keep the size's vertical padding but shrink to 6px horizontal
const SIZE_PX = { md: "px-[26px]", sm: "px-[18px]" } as const;

export function Button({
  variant = "primary",
  size = "md",
  href,
  target,
  arrow = false,
  children,
  ...rest
}: {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  href?: string;
  target?: string;
  arrow?: boolean;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const cls = [
    "group inline-flex items-center gap-2 font-body font-medium tracking-[-0.01em] leading-none",
    "rounded-pill cursor-pointer no-underline border border-transparent whitespace-nowrap",
    "transition-[background-color,border-color,color,transform] duration-(--dur-fast) ease-out",
    "active:translate-y-px",
    SIZES[size],
    variant === "ghost" ? "px-[6px]" : SIZE_PX[size],
    VARIANTS[variant],
  ].join(" ");
  const inner = (
    <>
      <span>{children}</span>
      {arrow ? (
        <span
          className="inline-block transition-transform duration-(--dur-base) ease-out group-hover:translate-x-[3px]"
          aria-hidden="true"
        >
          &rarr;
        </span>
      ) : null}
    </>
  );
  if (href) {
    return (
      <a
        className={cls}
        href={href}
        target={target}
        rel={target === "_blank" ? "noreferrer" : undefined}
        {...rest}
      >
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {inner}
    </button>
  );
}
