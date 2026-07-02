import React from 'react';

const SPECS_CSS = `
.ds-specs {
  position: fixed; inset: 0; z-index: 100;
  background: var(--surface-page);
  overflow-y: auto;
}
.ds-specs__inner { max-width: 1160px; margin: 0 auto; padding: 32px var(--gutter) 80px; }
.ds-specs__head {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding-bottom: 18px; border-bottom: var(--border-w) solid var(--border-strong);
  margin-bottom: 8px;
}
.ds-specs__title {
  font-family: var(--font-mono); font-size: var(--text-mono);
  letter-spacing: var(--tracking-mono); text-transform: uppercase; color: var(--text-accent);
}
.ds-specs__close {
  font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.05em;
  color: var(--text-meta); background: transparent; cursor: pointer;
  border: var(--border-w) solid var(--border-hairline); border-radius: 6px; padding: 5px 9px;
  transition: border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
}
.ds-specs__close:hover { border-color: var(--border-strong); color: var(--text-body); }
.ds-specs__section {
  font-family: var(--font-mono); font-size: var(--text-mono-sm);
  letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-meta);
  margin: 40px 0 6px;
}
.ds-specs__row {
  display: grid; grid-template-columns: 190px 1fr minmax(200px, auto);
  gap: 20px; align-items: center; padding: 10px 0;
  border-bottom: var(--border-w) solid var(--border-hairline);
}
.ds-specs__name { font-family: var(--font-mono); font-size: 11.5px; letter-spacing: 0.04em; color: var(--text-secondary); }
.ds-specs__value { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.03em; color: var(--text-faint); justify-self: end; text-align: right; }
.ds-specs__swatch { width: 44px; height: 22px; border-radius: 4px; border: 1px solid var(--border-hairline); }
.ds-specs__bar { height: 12px; background: var(--accent-100); border-left: 2px solid var(--accent-500); }
@media (max-width: 720px) { .ds-specs__row { grid-template-columns: 130px 1fr; } .ds-specs__value { display: none; } }
`;

if (typeof document !== 'undefined' && !document.getElementById('ds-specs-css')) {
  const s = document.createElement('style'); s.id = 'ds-specs-css'; s.textContent = SPECS_CSS;
  document.head.appendChild(s);
}

const COLOR_TOKENS = ['--paper-0', '--paper-1', '--paper-2', '--line-1', '--line-2', '--ink-300', '--ink-500', '--ink-700', '--ink-900', '--accent-050', '--accent-100', '--accent-500', '--accent-600', '--accent-700', '--live'];
const TYPE_TOKENS = [
  { name: '--text-hero', sample: 'Agents that ship', px: 40, weight: 700, tight: true },
  { name: '--text-h2', sample: 'Selected work', px: 30, weight: 700, tight: true },
  { name: '--text-h3', sample: 'Airline super agent program', px: 24, weight: 600, tight: true },
  { name: '--text-lead', sample: 'Production agent systems for the enterprise', px: 20, weight: 400 },
  { name: '--text-body', sample: 'Demos are easy. Production is the job.', px: 17, weight: 400 },
  { name: '--text-small', sample: 'Captions and footnotes', px: 15, weight: 400 },
  { name: '--text-mono', sample: 'META LABELS AND TICKERS', px: 13, mono: true }
];
const SPACE_TOKENS = ['--space-1', '--space-2', '--space-3', '--space-4', '--space-5', '--space-6', '--space-7', '--space-8', '--space-9', '--space-10', '--space-11', '--space-12', '--space-13'];
const MISC_TOKENS = ['--font-display', '--font-serif', '--font-mono', '--container', '--gutter', '--radius-sm', '--radius-md', '--radius-pill', '--ease-out', '--dur-fast', '--dur-base', '--dur-slow'];

export function SpecsOverlay({ openEventName = 'pf-specs-open' }) {
  const [open, setOpen] = React.useState(false);
  const [tokens, setTokens] = React.useState({});

  React.useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (e.key === '.' && !typing && !e.metaKey && !e.ctrlKey) { e.preventDefault(); setOpen((o) => !o); }
      else if (e.key === 'Escape') { setOpen(false); }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener(openEventName, onOpen);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener(openEventName, onOpen); };
  }, [openEventName]);

  React.useEffect(() => {
    if (!open) { document.body.style.overflow = ''; return; }
    document.body.style.overflow = 'hidden';
    const cs = getComputedStyle(document.documentElement);
    const all = {};
    COLOR_TOKENS.concat(SPACE_TOKENS, MISC_TOKENS, TYPE_TOKENS.map((t) => t.name)).forEach((n) => {
      all[n] = cs.getPropertyValue(n).trim();
    });
    setTokens(all);
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;
  return (
    <div className="ds-specs" role="dialog" aria-label="Design specs">
      <div className="ds-specs__inner">
        <div className="ds-specs__head">
          <span className="ds-specs__title">Specs &middot; living tokens, read from this page at runtime</span>
          <button type="button" className="ds-specs__close" onClick={() => setOpen(false)}>esc</button>
        </div>

        <div className="ds-specs__section">Type</div>
        {TYPE_TOKENS.map((t) => (
          <div key={t.name} className="ds-specs__row">
            <span className="ds-specs__name">{t.name}</span>
            <span style={{
              fontFamily: t.mono ? 'var(--font-mono)' : 'var(--font-display)',
              fontSize: t.px + 'px', fontWeight: t.weight || 400,
              letterSpacing: t.tight ? 'var(--tracking-heading)' : (t.mono ? 'var(--tracking-mono)' : 'var(--tracking-body)'),
              lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden'
            }}>{t.sample}</span>
            <span className="ds-specs__value">{tokens[t.name]}</span>
          </div>
        ))}

        <div className="ds-specs__section">Color</div>
        {COLOR_TOKENS.map((n) => (
          <div key={n} className="ds-specs__row">
            <span className="ds-specs__name">{n}</span>
            <span className="ds-specs__swatch" style={{ background: 'var(' + n + ')' }}></span>
            <span className="ds-specs__value">{tokens[n]}</span>
          </div>
        ))}

        <div className="ds-specs__section">Spacing</div>
        {SPACE_TOKENS.map((n) => (
          <div key={n} className="ds-specs__row">
            <span className="ds-specs__name">{n}</span>
            <span className="ds-specs__bar" style={{ width: tokens[n] }}></span>
            <span className="ds-specs__value">{tokens[n]}</span>
          </div>
        ))}

        <div className="ds-specs__section">Face, layout, motion</div>
        {MISC_TOKENS.map((n) => (
          <div key={n} className="ds-specs__row">
            <span className="ds-specs__name">{n}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tokens[n]}</span>
            <span className="ds-specs__value"></span>
          </div>
        ))}
      </div>
    </div>
  );
}
