import React from 'react';

const NAV_CSS = `
.pf-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 50;
  height: var(--nav-height);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 var(--gutter);
  background: transparent;
  border-bottom: var(--border-w) solid transparent;
  transition: background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out);
}
.pf-nav--scrolled {
  background: color-mix(in srgb, var(--surface-page) 82%, transparent);
  -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  border-bottom-color: var(--border-hairline);
}
.pf-nav__mark {
  font-family: var(--font-mono); font-size: 14px; letter-spacing: 0.02em;
  color: var(--text-body); text-decoration: none; font-weight: 500;
}
.pf-nav__links { display: flex; gap: 28px; align-items: center; }
.pf-nav__cmdk {
  font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.05em;
  color: var(--text-meta); background: transparent; cursor: pointer;
  border: var(--border-w) solid var(--border-hairline); border-radius: 6px;
  padding: 5px 9px; line-height: 1;
  transition: border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
}
.pf-nav__cmdk:hover { border-color: var(--border-strong); color: var(--text-body); }
@media (max-width: 720px) { .pf-nav__cmdk { display: none; } }
.pf-nav__link {
  font-size: 15px; color: var(--text-secondary); text-decoration: none;
  transition: color var(--dur-fast) var(--ease-out);
}
.pf-nav__link:hover { color: var(--text-body); }
@media (max-width: 640px) { .pf-nav__links { gap: 18px; } .pf-nav__link { font-size: 14px; } }
`;

if (typeof document !== 'undefined' && !document.getElementById('pf-nav-css')) {
  const s = document.createElement('style'); s.id = 'pf-nav-css'; s.textContent = NAV_CSS;
  document.head.appendChild(s);
}

export function SiteNav({ mark = 'hamidettefagh.com', links = [], cmdk = false, onNavigate }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const go = (e, href) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    if (onNavigate) onNavigate(href);
  };
  return (
    <nav className={'pf-nav' + (scrolled ? ' pf-nav--scrolled' : '')}>
      <a className="pf-nav__mark" href="index.html">{mark}</a>
      <div className="pf-nav__links">
        {links.map((l) => (
          <a key={l.href} className="pf-nav__link" href={l.href} onClick={(e) => go(e, l.href)}>{l.label}</a>
        ))}
        {cmdk ? (
          <button
            type="button"
            className="pf-nav__cmdk"
            title="Command menu"
            onClick={() => window.dispatchEvent(new Event('pf-cmdk-open'))}
          >&#8984;K</button>
        ) : null}
      </div>
    </nav>
  );
}
