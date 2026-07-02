import React from 'react';

const ACCENT_CSS = `
.ds-accent {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: var(--serif-accent-weight);
  letter-spacing: -0.01em;
  color: var(--text-accent);
}
.ds-accent--underline {
  text-decoration: underline;
  text-decoration-thickness: var(--underline-thickness-hero);
  text-underline-offset: var(--underline-offset);
  text-decoration-color: var(--accent-500);
}
.ds-accent--ink { color: inherit; }
`;

if (typeof document !== 'undefined' && !document.getElementById('ds-accent-css')) {
  const s = document.createElement('style'); s.id = 'ds-accent-css'; s.textContent = ACCENT_CSS;
  document.head.appendChild(s);
}

export function Accent({ underline = false, ink = false, children, ...rest }) {
  const cls = 'ds-accent' + (underline ? ' ds-accent--underline' : '') + (ink ? ' ds-accent--ink' : '');
  return <em className={cls} {...rest}>{children}</em>;
}
