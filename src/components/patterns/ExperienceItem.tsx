// Experience row — components/patterns/ExperienceItem.jsx
export function ExperienceItem({
  dates,
  role,
  org,
  note,
}: {
  dates: string;
  role: string;
  org?: string;
  note?: string;
}) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-6 py-[22px] border-t border-line-1 [@media(max-width:720px)]:grid-cols-1 [@media(max-width:720px)]:gap-[6px]">
      <span className="font-mono text-mono tracking-mono uppercase text-ink-500 pt-[3px]">
        {dates}
      </span>
      <span>
        <h3 className="font-display font-semibold text-[19px] tracking-heading m-0">
          {role}
        </h3>
        {org ? <p className="text-ink-700 text-small mt-1 mb-0">{org}</p> : null}
        {note ? (
          <p className="text-ink-500 text-small mt-2 mb-0 leading-tight max-w-[60ch]">
            {note}
          </p>
        ) : null}
      </span>
    </div>
  );
}
