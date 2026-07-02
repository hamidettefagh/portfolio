import React from 'react';

const EXP_CSS = `
.ds-exp {
  display: grid; grid-template-columns: 160px 1fr; gap: 24px;
  padding: 22px 0; border-top: var(--border-w) solid var(--border-hairline);
}
.ds-exp__dates {
  font-family: var(--font-mono); font-size: var(--text-mono);
  letter-spacing: var(--tracking-mono); text-transform: uppercase;
  color: var(--text-meta); padding-top: 3px;
}
.ds-exp__role {
  font-family: var(--font-display); font-weight: var(--weight-heading);
  font-size: 19px; letter-spacing: var(--tracking-heading); margin: 0;
}
.ds-exp__org { color: var(--text-secondary); font-size: var(--text-small); margin: 4px 0 0; }
.ds-exp__note { color: var(--text-meta); font-size: var(--text-small); margin: 8px 0 0; line-height: var(--leading-tight); max-width: 60ch; }
.ds-exp--placeholder .ds-exp__role, .ds-exp--placeholder .ds-exp__dates { color: var(--text-faint); }
.ds-exp--placeholder { border-top-style: dashed; }
@media (max-width: 720px) { .ds-exp { grid-template-columns: 1fr; gap: 6px; } }
`;

if (typeof document !== 'undefined' && !document.getElementById('ds-exp-css')) {
  const s = document.createElement('style'); s.id = 'ds-exp-css'; s.textContent = EXP_CSS;
  document.head.appendChild(s);
}

export function ExperienceItem({ dates, role, org, note, placeholder = false, ...rest }) {
  return (
    <div className={'ds-exp' + (placeholder ? ' ds-exp--placeholder' : '')} {...rest}>
      <span className="ds-exp__dates">{dates}</span>
      <span>
        <h3 className="ds-exp__role">{role}</h3>
        {org ? <p className="ds-exp__org">{org}</p> : null}
        {note ? <p className="ds-exp__note">{note}</p> : null}
      </span>
    </div>
  );
}
