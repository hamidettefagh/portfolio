import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/SiteNav";
import { Rule } from "@/components/primitives/Rule";
import { PageIntro } from "@/components/site/PageIntro";
import { LAB, LAB_STATUS, byNewest, monthLabel, monthShort, type LabStatus } from "@/lib/lab";

const description =
  "Experiments I run in the open on my own site and tools. Each starts with a question and ends with a result, including the ones that did not go my way.";

export const metadata: Metadata = {
  title: "Lab | Hamid Ettefagh",
  description,
  alternates: { canonical: "/lab" },
};

const ORDER: LabStatus[] = ["running", "shipped", "planned"];

function StatusTag({ status }: { status: LabStatus }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-[7px] font-mono text-mono-sm tracking-[0.06em] uppercase leading-none",
        status === "planned" ? "text-ink-500" : "text-ink-900",
      ].join(" ")}
    >
      <span
        className={[
          "w-[7px] h-[7px] rounded-full flex-none",
          status === "running" ? "bg-live" : status === "shipped" ? "bg-accent-500" : "border border-ink-300",
        ].join(" ")}
        aria-hidden="true"
      ></span>
      {LAB_STATUS[status].label}
    </span>
  );
}

export default function Lab() {
  return (
    <div>
      <SiteNav links={[{ href: "/", label: "Home" }]} />
      <article className="max-w-[880px] mx-auto pt-[calc(var(--nav-height)+var(--spacing-11))] px-(--gutter) pb-11">
        <PageIntro
          eyebrow={["Lab"]}
          title="Lab"
          lead="Experiments I run in the open, on my own site and tools. Each one starts with a question and ends with a result, including the ones that did not go my way."
        >
          Running means it is measured again on every change. Shipped means it
          is done and has a result. Planned means it is designed and waiting on
          something real, and its page says what.
        </PageIntro>

        {ORDER.map((status) => {
          const entries = LAB.filter((e) => e.status === status).sort(byNewest);
          if (!entries.length) return null;
          return (
            <section key={status} className="mt-12">
              <Rule label={`${LAB_STATUS[status].label} (${entries.length})`} />
              <ol className="list-none p-0 m-0">
                {entries.map((e) => (
                  <li key={e.slug} id={e.slug} className="border-b border-line-1 scroll-mt-[96px]">
                    <Link
                      href={e.href ?? "#"}
                      className="group grid grid-cols-[132px_minmax(0,1fr)_24px] gap-6 py-7 no-underline text-inherit [@media(max-width:640px)]:grid-cols-[minmax(0,1fr)_24px] [@media(max-width:640px)]:gap-y-3"
                    >
                      <span className="pt-[5px] [@media(max-width:640px)]:col-span-2">
                        <StatusTag status={e.status} />
                        <span className="block font-mono text-mono-sm tracking-[0.04em] text-ink-500 mt-2 [@media(max-width:640px)]:inline [@media(max-width:640px)]:ml-3">
                          {monthLabel(e.date)}
                          {e.updated ? (
                            <span className="block [@media(max-width:640px)]:inline">
                              <span className="[@media(min-width:641px)]:hidden"> &middot; </span>
                              updated {monthShort(e.updated)}
                            </span>
                          ) : null}
                        </span>
                      </span>
                      <span>
                        <span className="block font-display font-semibold text-[22px] tracking-heading leading-heading transition-colors duration-(--dur-fast) ease-out group-hover:text-accent-700">
                          {e.title}
                        </span>
                        <span className="block mt-3 text-small leading-tight text-ink-500 max-w-[60ch]">
                          {e.question}
                        </span>
                        <span className="block mt-2 text-body leading-[1.5] text-ink-900 max-w-[60ch]">
                          {e.result}
                        </span>
                      </span>
                      <span
                        className="text-[18px] text-ink-300 pt-[3px] justify-self-end transition-[transform,color] duration-(--dur-base) ease-out group-hover:translate-x-[3px] group-hover:text-accent-700"
                        aria-hidden="true"
                      >
                        &rarr;
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </article>
    </div>
  );
}
