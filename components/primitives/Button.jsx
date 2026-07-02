import React from 'react';

const BTN_CSS = `
.ds-btn {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-body); font-weight: var(--weight-medium);
  letter-spacing: -0.01em; line-height: 1;
  border-radius: var(--radius-pill); cursor: pointer;
  text-decoration: none; border: var(--border-w) solid transparent;
  white-space: nowrap;
  transition: background var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out),
    transform var(--dur-fast) var(--ease-out);
}
.ds-btn:active { transform: translateY(1px); }
.ds-btn--md { font-size: 16px; padding: 14px 26px; }
.ds-btn--sm { font-size: 14px; padding: 10px 18px; }
.ds-btn--primary { background: var(--accent-600); color: var(--text-on-accent); }
.ds-btn--primary:hover { background: var(--accent-700); }
.ds-btn--secondary { background: transparent; color: var(--text-body); border-color: var(--border-strong); }
.ds-btn--secondary:hover { border-color: var(--ink-900); }
.ds-btn--ghost { background: transparent; color: var(--text-body); padding-left: 6px; padding-right: 6px; }
.ds-btn--ghost:hover { color: var(--link-hover); }
.ds-btn[disabled] { opacity: 0.45; pointer-events: none; }
.ds-btn__arrow { font-family: var(--font-body); transition: transform var(--dur-base) var(--ease-out); display: inline-block; }
.ds-btn:hover .ds-btn__arrow { transform: translateX(3px); }
`;

if (typeof document !== 'undefined' && !document.getElementById('ds-btn-css')) {
  const s = document.createElement('style'); s.id = 'ds-btn-css'; s.textContent = BTN_CSS;
  document.head.appendChild(s);
}

export function Button({ variant = 'primary', size = 'md', href, target, arrow = false, children, ...rest }) {
  const cls = 'ds-btn ds-btn--' + variant + ' ds-btn--' + size;
  const inner = (
    <React.Fragment>
      <span>{children}</span>
      {arrow ? <span className="ds-btn__arrow" aria-hidden="true">&rarr;</span> : null}
    </React.Fragment>
  );
  if (href) {
    return <a className={cls} href={href} target={target} rel={target === '_blank' ? 'noreferrer' : undefined} {...rest}>{inner}</a>;
  }
  return <button type="button" className={cls} {...rest}>{inner}</button>;
}
