import Link from "next/link";
import { Rule } from "@/components/primitives/Rule";

// Experience, drawn as a trace: each role is a span on a shared time axis, and
// the work inside a role hangs under it as child spans. On phones the axis is
// dropped and it reads as the plain list it always was.

type Child = { label: string; href?: string };

type Span = {
  dates: string;
  role: string;
  org: string;
  note?: string;
  // Fractional years. `from: null` means it began before the axis starts;
  // `to: null` means it is still running.
  from: number | null;
  to: number | null;
  children?: Child[];
};

const AXIS_START = 2022;

const SPANS: Span[] = [
  {
    dates: "2025 - Now",
    role: "Distinguished Forward Deployed Engineer",
    org: "Salesforce",
    note: "Production agent deployments and technical advisory for strategic enterprise accounts. Director level since November 2026, on a specialist team for the most complex builds. Joined as a Senior Forward Deployed Engineer in 2025.",
    from: 2025.75,
    to: null,
    children: [
      { label: "Multi-agent customer operations platform", href: "/work/airline-super-agent" },
      { label: "Service agents for a two-sided marketplace", href: "/work/dining-platform-agents" },
      { label: "InsightForce" },
      { label: "The two gates, built in the open", href: "/two-gates" },
    ],
  },
  {
    dates: "2022 - 2025",
    role: "Senior Technical Architect, Strategic Accounts",
    org: "Salesforce",
    note: "Architecture and delivery leadership across consumer electronics, telecom, and travel programs, leading teams of 25+ engineers.",
    from: 2022.12,
    to: 2025.75,
    children: [
      { label: "Global deal registration program" },
      { label: "Contact center AI proof of concept" },
    ],
  },
  {
    dates: "Earlier",
    role: "Enterprise delivery roles",
    org: "Accenture, Deloitte, and Cognizant",
    from: null,
    to: 2022.12,
  },
];

const linkCls =
  "text-ink-900 underline decoration-line-2 decoration-1 underline-offset-[3px] transition-[color,text-decoration-color] duration-(--dur-fast) ease-out hover:text-accent-700 hover:decoration-current";

export function ExperienceSection() {
  // Rendered at build time, like the "Updated" date in the hero.
  const today = new Date();
  const now = today.getFullYear() + (today.getMonth() + today.getDate() / 31) / 12;
  const axisEnd = Math.floor(now) + 1;
  const years = Array.from({ length: axisEnd - AXIS_START }, (_, i) => AXIS_START + i);
  const pct = (year: number) => ((year - AXIS_START) / (axisEnd - AXIS_START)) * 100;

  const rowCls =
    "grid grid-cols-[160px_minmax(0,1fr)_var(--axis)] gap-6 [@media(min-width:721px)_and_(max-width:860px)]:grid-cols-[160px_minmax(0,1fr)] [@media(max-width:720px)]:grid-cols-1 [@media(max-width:720px)]:gap-[6px]";

  return (
    <section className="pt-12 scroll-mt-[84px]" id="experience">
      <div className="mb-8">
        <Rule label="Experience" />
        <h2 className="font-display font-bold text-h2 tracking-heading leading-[1.05] mt-6 mb-0">
          Where the work happens
        </h2>
        <p className="mt-4 mb-0 text-small leading-tight text-ink-500 max-w-[58ch] [@media(max-width:860px)]:hidden">
          Read it like a trace. Each role is a span, and the work inside it is a
          child span.
        </p>
      </div>

      <div
        className="relative border-b border-line-1"
        style={{ "--axis": "min(36%, 400px)" } as React.CSSProperties}
      >
        {/* The shared time axis: year gridlines and a marker for today. */}
        <div
          className="absolute top-0 bottom-0 right-0 w-(--axis) pointer-events-none [@media(max-width:860px)]:hidden"
          aria-hidden="true"
        >
          {years.map((y) => (
            <span
              key={y}
              className="absolute top-0 bottom-0 border-l border-line-1"
              style={{ left: `${pct(y)}%` }}
            ></span>
          ))}
          <span
            className="absolute top-0 bottom-0 border-l border-accent-500"
            style={{ left: `${pct(now)}%` }}
          ></span>
        </div>

        <div className={`${rowCls} pb-3 [@media(max-width:860px)]:hidden`} aria-hidden="true">
          <span></span>
          <span></span>
          <div className="relative h-[18px]">
            {years.map((y) => (
              <span
                key={y}
                className="absolute top-0 pl-[6px] font-mono text-mono-sm tracking-[0.04em] text-ink-500"
                style={{ left: `${pct(y)}%` }}
              >
                {y}
              </span>
            ))}
            <span
              className="absolute top-0 -translate-x-full pr-[6px] font-mono text-mono-sm tracking-[0.04em] text-accent-600 bg-paper-0"
              style={{ left: `${pct(now)}%` }}
            >
              now
            </span>
          </div>
        </div>

        {SPANS.map((s) => {
          const left = s.from === null ? 0 : pct(s.from);
          const right = s.to === null ? pct(now) : pct(s.to);
          const running = s.to === null;
          return (
            <div key={s.role} className={`${rowCls} relative py-[22px] border-t border-line-1`}>
              <span className="font-mono text-mono tracking-mono uppercase text-ink-500 pt-[3px]">
                {s.dates}
              </span>
              <span>
                <h3 className="font-display font-semibold text-[19px] tracking-heading m-0">
                  {s.role}
                </h3>
                <p className="text-ink-700 text-small mt-1 mb-0">{s.org}</p>
                {s.note ? (
                  <p className="text-ink-500 text-small mt-2 mb-0 leading-tight max-w-[60ch]">
                    {s.note}
                  </p>
                ) : null}
                {s.children ? (
                  <ul className="list-none p-0 mt-4 mb-0 ml-[3px] border-l border-line-2">
                    {s.children.map((c) => (
                      <li
                        key={c.label}
                        className="relative pl-5 py-[5px] text-small leading-tight text-ink-700 before:content-[''] before:absolute before:left-0 before:top-[0.95em] before:w-3 before:border-t before:border-line-2"
                      >
                        {c.href ? (
                          <Link href={c.href} className={linkCls}>
                            {c.label}
                          </Link>
                        ) : (
                          c.label
                        )}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </span>
              <div className="relative h-[24px] [@media(max-width:860px)]:hidden" aria-hidden="true">
                <span
                  className={[
                    "absolute top-[8px] h-[8px] rounded-[2px]",
                    running ? "bg-accent-600" : "bg-ink-300",
                    s.from === null
                      ? "[mask-image:linear-gradient(to_right,transparent,black_70%)]"
                      : "",
                  ].join(" ")}
                  style={{ left: `${left}%`, width: `${Math.max(right - left, 0.5)}%` }}
                ></span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <Rule label="Credentials" />
        <p className="text-small leading-tight text-ink-700 mt-5 mb-0 max-w-[70ch]">
          Claude Certified Architect, Anthropic &middot; 17 Salesforce
          certifications &middot; Professional certificate, MIT xPRO
        </p>
      </div>
    </section>
  );
}
