import { Eyebrow } from "@/components/primitives/Eyebrow";

// The opening block every inner page shares: eyebrow, title, lead, and an
// optional small note underneath. Same type scale as the original tool pages.
export function PageIntro({
  eyebrow,
  title,
  lead,
  children,
  leadWidth = "56ch",
}: {
  eyebrow: string[];
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
  leadWidth?: string;
}) {
  return (
    <>
      <Eyebrow dot="accent">{eyebrow}</Eyebrow>
      <h1 className="font-display font-bold text-[clamp(40px,5.4vw,68px)] tracking-display leading-[1.02] mt-6 mb-6 text-balance">
        {title}
      </h1>
      {lead ? (
        <p
          className="text-lead leading-[1.5] text-ink-700 m-0"
          style={{ maxWidth: leadWidth }}
        >
          {lead}
        </p>
      ) : null}
      {children ? (
        <div className="mt-4 text-small text-ink-500 leading-tight max-w-[70ch]">
          {children}
        </div>
      ) : null}
    </>
  );
}

// Nav links for pages that live under the lab or beside it.
export const INNER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/lab", label: "Lab" },
];
