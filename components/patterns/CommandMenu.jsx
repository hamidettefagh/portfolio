import React from 'react';

const CMDK_CSS = `
.ds-cmdk__scrim {
  position: fixed; inset: 0; z-index: 90;
  background: rgba(33, 29, 24, 0.16);
}
.ds-cmdk {
  position: fixed; z-index: 91; left: 50%; top: 16vh;
  transform: translateX(-50%);
  width: min(560px, calc(100vw - 40px));
  background: var(--surface-raised);
  border: var(--border-w) solid var(--border-hairline);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-float);
  overflow: hidden;
}
.ds-cmdk__input {
  width: 100%; border: none; outline: none; background: transparent;
  font-family: var(--font-body); font-size: 17px; color: var(--text-body);
  padding: 16px 18px; border-bottom: var(--border-w) solid var(--border-hairline);
  letter-spacing: var(--tracking-body);
}
.ds-cmdk__input::placeholder { color: var(--text-faint); }
.ds-cmdk__list { max-height: 320px; overflow-y: auto; padding: 6px 0; }
.ds-cmdk__item {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 11px 18px; cursor: pointer; font-size: 15px; color: var(--text-body);
}
.ds-cmdk__item--active { background: var(--surface-inset); }
.ds-cmdk__hint {
  font-family: var(--font-mono); font-size: var(--text-mono-sm);
  letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-faint);
}
.ds-cmdk__empty { padding: 18px; font-size: 15px; color: var(--text-meta); }
.ds-cmdk__footer {
  display: flex; gap: 18px; padding: 10px 18px;
  border-top: var(--border-w) solid var(--border-hairline);
  font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--text-faint);
}
`;

if (typeof document !== 'undefined' && !document.getElementById('ds-cmdk-css')) {
  const s = document.createElement('style'); s.id = 'ds-cmdk-css'; s.textContent = CMDK_CSS;
  document.head.appendChild(s);
}

export function CommandMenu({ items = [], openEventName = 'pf-cmdk-open' }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState(0);
  const [flash, setFlash] = React.useState(null);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault(); setOpen((o) => !o);
      } else if (e.key === 'Escape') { setOpen(false); }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener(openEventName, onOpen);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener(openEventName, onOpen); };
  }, [openEventName]);

  React.useEffect(() => {
    if (open) {
      setQuery(''); setActive(0); setFlash(null);
      const t = setTimeout(() => { if (inputRef.current) inputRef.current.focus(); }, 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  const filtered = items.filter((it) => it.label.toLowerCase().includes(query.toLowerCase()));

  const run = (item) => {
    item.action();
    if (item.confirm) {
      setFlash({ label: item.label, text: item.confirm });
      setTimeout(() => setOpen(false), 900);
    } else {
      setOpen(false);
    }
  };

  const onInputKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter' && filtered[active]) { e.preventDefault(); run(filtered[active]); }
  };

  if (!open) return null;
  return (
    <React.Fragment>
      <div className="ds-cmdk__scrim" onClick={() => setOpen(false)}></div>
      <div className="ds-cmdk" role="dialog" aria-label="Command menu">
        <input
          ref={inputRef}
          className="ds-cmdk__input"
          placeholder="Where to?"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActive(0); }}
          onKeyDown={onInputKey}
        />
        <div className="ds-cmdk__list">
          {filtered.length === 0 ? <div className="ds-cmdk__empty">Nothing matches.</div> : null}
          {filtered.map((it, i) => (
            <div
              key={it.label}
              className={'ds-cmdk__item' + (i === active ? ' ds-cmdk__item--active' : '')}
              onMouseEnter={() => setActive(i)}
              onClick={() => run(it)}
            >
              <span>{flash && flash.label === it.label ? flash.text : it.label}</span>
              <span className="ds-cmdk__hint">{it.hint}</span>
            </div>
          ))}
        </div>
        <div className="ds-cmdk__footer">
          <span>&#8593;&#8595; navigate</span>
          <span>&#8629; select</span>
          <span>esc close</span>
        </div>
      </div>
    </React.Fragment>
  );
}
