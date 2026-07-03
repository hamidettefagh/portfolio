// Inline text link — components/primitives/TextLink.jsx
export function TextLink({
  href = "#",
  external = false,
  children,
  ...rest
}: {
  href?: string;
  external?: boolean;
  children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className="text-ink-900 cursor-pointer underline decoration-line-2 decoration-1 underline-offset-[3px] transition-[color,text-decoration-color] duration-(--dur-fast) ease-out hover:text-accent-700 hover:decoration-current"
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      {...rest}
    >
      {children}
      {external ? (
        <span className="text-[0.75em] ml-[0.15em] inline-block no-underline" aria-hidden="true">
          &#8599;
        </span>
      ) : null}
    </a>
  );
}
