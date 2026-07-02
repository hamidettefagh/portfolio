import React from 'react';

const RULE_CSS = `
.ds-rule { display: flex; align-items: center; gap: 16px; }
.ds-rule__line { flex: 1; height: 0; border-top: var(--border-w) solid var(--border-hairline); }
.ds-rule--strong .ds-rule__line { border-top-color: var(--border-strong); }
.ds-rule__label {
  font-family: var(--font-mono); font-size: var(--text-mono);
  letter-spacing: var(--tracking-mono); text-transform: uppercase;
  color: var(--text-accent); flex: none;
}
`;

if (typeof document !== 'undefined' && !document.getElementById('ds-rule-css')) {
  const s = document.createElement('style'); s.id = 'ds-rule-css'; s.textContent = RULE_CSS;
  document.head.appendChild(s);
}

export function Rule({ label, strong = false, ...rest }) {
  return (
    <div className={'ds-rule' + (strong ? ' ds-rule--strong' : '')} role="separator" {...rest}>
      {label ? <span className="ds-rule__label">{label}</span> : null}
      <span className="ds-rule__line"></span>
    </div>
  );
}
