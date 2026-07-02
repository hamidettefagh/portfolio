import React from 'react';

const EYEBROW_CSS = `
.ds-eyebrow {
  font-family: var(--font-mono); font-size: var(--text-mono);
  letter-spacing: var(--tracking-mono); text-transform: uppercase;
  color: var(--text-meta); display: inline-flex; align-items: center; gap: 10px;
  font-weight: 400;
}
.ds-eyebrow--accent { color: var(--text-accent); }
.ds-eyebrow__dot {
  width: 7px; height: 7px; border-radius: 50%; flex: none;
}
.ds-eyebrow__sep { color: var(--text-faint); }
`;

if (typeof document !== 'undefined' && !document.getElementById('ds-eyebrow-css')) {
  const s = document.createElement('style'); s.id = 'ds-eyebrow-css'; s.textContent = EYEBROW_CSS;
  document.head.appendChild(s);
}

export function Eyebrow({ dot, accent = false, children, ...rest }) {
  const items = Array.isArray(children) ? children : [children];
  const parts = [];
  items.forEach((c, i) => {
    if (i > 0) parts.push(<span key={'s' + i} className="ds-eyebrow__sep" aria-hidden="true">&middot;</span>);
    parts.push(<span key={'c' + i}>{c}</span>);
  });
  return (
    <span className={'ds-eyebrow' + (accent ? ' ds-eyebrow--accent' : '')} {...rest}>
      {dot ? (
        <span
          className="ds-eyebrow__dot"
          style={{ background: dot === 'live' ? 'var(--live)' : 'var(--accent-500)' }}
          aria-hidden="true"
        ></span>
      ) : null}
      {parts}
    </span>
  );
}
