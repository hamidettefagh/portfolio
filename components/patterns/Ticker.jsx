import React from 'react';

const TICKER_CSS = `
.ds-ticker {
  border-top: var(--border-w) solid var(--border-strong);
  border-bottom: var(--border-w) solid var(--border-strong);
  padding: 14px 0;
  display: flex; align-items: center; gap: 32px;
  overflow: hidden;
}
.ds-ticker__label {
  font-family: var(--font-mono); font-size: var(--text-mono);
  letter-spacing: var(--tracking-mono); text-transform: uppercase;
  color: var(--text-accent); flex: none; display: inline-flex; align-items: center; gap: 8px;
}
.ds-ticker__dot { width: 7px; height: 7px; border-radius: 50%; background: var(--live); }
.ds-ticker__items { display: flex; gap: 40px; flex-wrap: wrap; }
.ds-ticker__item {
  font-family: var(--font-mono); font-size: var(--text-mono);
  letter-spacing: 0.04em; color: var(--text-secondary); white-space: nowrap;
}
`;

if (typeof document !== 'undefined' && !document.getElementById('ds-ticker-css')) {
  const s = document.createElement('style'); s.id = 'ds-ticker-css'; s.textContent = TICKER_CSS;
  document.head.appendChild(s);
}

export function Ticker({ label = 'Now', live = true, items = [], ...rest }) {
  return (
    <div className="ds-ticker" {...rest}>
      <span className="ds-ticker__label">
        {live ? <span className="ds-ticker__dot" aria-hidden="true"></span> : null}
        {label}
      </span>
      <span className="ds-ticker__items">
        {items.map((it, i) => <span key={i} className="ds-ticker__item">{it}</span>)}
      </span>
    </div>
  );
}
