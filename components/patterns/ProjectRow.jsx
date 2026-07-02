import React from 'react';

const ROW_CSS = `
.ds-projectrow {
  display: grid; grid-template-columns: 56px 1fr auto 28px;
  gap: 24px; align-items: baseline;
  padding: 28px 0; border-top: var(--border-w) solid var(--border-hairline);
  cursor: pointer; text-decoration: none; color: inherit;
}
.ds-projectrow__index {
  font-family: var(--font-mono); font-size: var(--text-mono);
  color: var(--text-faint); letter-spacing: var(--tracking-mono);
}
.ds-projectrow__title {
  font-family: var(--font-display); font-weight: var(--weight-heading);
  font-size: 24px; letter-spacing: var(--tracking-heading);
  line-height: var(--leading-heading); margin: 0;
  transition: color var(--dur-fast) var(--ease-out);
}
.ds-projectrow:hover .ds-projectrow__title { color: var(--link-hover); }
.ds-projectrow__summary {
  margin: 8px 0 0; font-size: var(--text-small); color: var(--text-secondary);
  line-height: var(--leading-tight); max-width: 56ch;
}
.ds-projectrow__org { justify-self: end; align-self: center; }
.ds-projectrow__arrow {
  font-size: 18px; color: var(--text-faint); align-self: center; justify-self: end;
  transition: transform var(--dur-base) var(--ease-out), color var(--dur-fast) var(--ease-out);
}
.ds-projectrow:hover .ds-projectrow__arrow { transform: translate(2px, -2px); color: var(--link-hover); }
@media (max-width: 720px) {
  .ds-projectrow { grid-template-columns: 1fr 28px; }
  .ds-projectrow__index, .ds-projectrow__org { display: none; }
}
`;

if (typeof document !== 'undefined' && !document.getElementById('ds-projectrow-css')) {
  const s = document.createElement('style'); s.id = 'ds-projectrow-css'; s.textContent = ROW_CSS;
  document.head.appendChild(s);
}

export function ProjectRow({ index, title, summary, org, href = '#', onClick, ...rest }) {
  return (
    <a className="ds-projectrow" href={href} onClick={onClick} {...rest}>
      <span className="ds-projectrow__index">{index}</span>
      <span>
        <h3 className="ds-projectrow__title">{title}</h3>
        {summary ? <p className="ds-projectrow__summary">{summary}</p> : null}
      </span>
      {org ? (
        <span className="ds-projectrow__org">
          <span className="ds-tag" style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-mono-sm)',
            letterSpacing: '0.06em', textTransform: 'uppercase',
            color: 'var(--text-secondary)', border: 'var(--border-w) solid var(--border-hairline)',
            borderRadius: 'var(--radius-pill)', padding: '5px 11px', lineHeight: 1,
            whiteSpace: 'nowrap', display: 'inline-flex'
          }}>{org}</span>
        </span>
      ) : null}
      <span className="ds-projectrow__arrow" aria-hidden="true">&#8599;</span>
    </a>
  );
}
