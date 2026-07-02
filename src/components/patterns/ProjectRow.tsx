import Link from "next/link";
import { Tag } from "@/components/primitives/Tag";

// Hairline work-list row — components/patterns/ProjectRow.jsx
const ROW_CLS = [
  "group grid grid-cols-[56px_1fr_auto_28px] gap-6 items-baseline py-[28px]",
  "border-t border-line-1 no-underline text-inherit",
  "[@media(max-width:720px)]:grid-cols-[1fr_28px]",
].join(" ");

function RowContent({
  index,
  title,
  summary,
  org,
}: {
  index: string;
  title: string;
  summary?: string;
  org?: string;
}) {
  return (
    <>
      <span className="font-mono text-mono text-ink-300 tracking-mono [@media(max-width:720px)]:hidden">
        {index}
      </span>
      <span>
        <h3 className="font-display font-semibold text-[24px] tracking-heading leading-heading m-0 transition-colors duration-(--dur-fast) ease-out group-hover:text-accent-700">
          {title}
        </h3>
        {summary ? (
          <p className="mt-2 mb-0 text-small text-ink-700 leading-tight max-w-[56ch]">
            {summary}
          </p>
        ) : null}
      </span>
      {org ? (
        <span className="justify-self-end self-center [@media(max-width:720px)]:hidden">
          <Tag>{org}</Tag>
        </span>
      ) : null}
      <span
        className="text-[18px] text-ink-300 self-center justify-self-end [transition:transform_var(--dur-base)_var(--ease-out),color_var(--dur-fast)_var(--ease-out)] group-hover:translate-x-[2px] group-hover:-translate-y-[2px] group-hover:text-accent-700"
        aria-hidden="true"
      >
        &#8599;
      </span>
    </>
  );
}

export function ProjectRow({
  index,
  title,
  summary,
  org,
  href,
}: {
  index: string;
  title: string;
  summary?: string;
  org?: string;
  href?: string;
}) {
  if (href) {
    return (
      <Link className={`${ROW_CLS} cursor-pointer`} href={href}>
        <RowContent index={index} title={title} summary={summary} org={org} />
      </Link>
    );
  }
  return (
    <div className={ROW_CLS}>
      <RowContent index={index} title={title} summary={summary} org={org} />
    </div>
  );
}
