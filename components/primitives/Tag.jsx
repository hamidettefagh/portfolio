import React from 'react';

const TAG_CSS = `
.ds-tag {
  display: inline-flex; align-items: center;
  font-family: var(--font-mono); font-size: var(--text-mono-sm);
  letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--text-secondary);
  border: var(--border-w) solid var(--border-hairline);
  border-radius: var(--radius-pill);
  padding: 5px 11px; line-height: 1; white-space: nowrap;
}
.ds-tag--fill { background: var(--surface-inset); border-color: transparent; }
.ds-tag--accent { color: var(--text-accent); border-color: var(--accent-100); background: var(--accent-050); }
`;

if (typeof document !== 'undefined' && !document.getElementById('ds-tag-css')) {
  const s = document.createElement('style'); s.id = 'ds-tag-css'; s.textContent = TAG_CSS;
  document.head.appendChild(s);
}

export function Tag({ variant = 'outline', children, ...rest }) {
  return <span className={'ds-tag' + (variant !== 'outline' ? ' ds-tag--' + variant : '')} {...rest}>{children}</span>;
}
