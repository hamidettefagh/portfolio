import React from 'react';
import { Eyebrow } from '../../components/primitives/Eyebrow.jsx';
import { Accent } from '../../components/primitives/Accent.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { Ticker } from '../../components/patterns/Ticker.jsx';

const HERO_CSS = `
.pf-hero {
  padding: calc(var(--nav-height) + var(--space-12)) 0 var(--space-10);
  position: relative;
}
.pf-hero__wash {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(1100px 560px at 88% -20%, var(--surface-wash), transparent 70%);
}
.pf-hero__inner { position: relative; }
.pf-hero__title {
  font-family: var(--font-display); font-weight: var(--weight-display);
  font-size: var(--text-hero); letter-spacing: var(--tracking-display);
  line-height: var(--leading-display); margin: var(--space-6) 0 0;
  color: var(--text-display); text-wrap: balance;
}
.pf-hero__cols {
  display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: var(--space-10); margin-top: var(--space-9); align-items: start;
}
.pf-hero__lead {
  font-size: var(--text-lead); line-height: 1.5; letter-spacing: var(--tracking-body);
  color: var(--text-body); margin: 0; max-width: var(--measure-lead);
}
.pf-hero__aside {
  font-family: var(--font-serif); font-style: italic; font-size: 19px;
  font-weight: 450; line-height: 1.55; color: var(--text-secondary);
  border-left: 2px solid var(--accent-500); padding-left: var(--space-6); margin: 0;
}
.pf-hero__actions { display: flex; gap: 14px; margin-top: var(--space-9); }
.pf-hero__ticker { margin-top: var(--space-11); }
@media (max-width: 860px) {
  .pf-hero__cols { grid-template-columns: 1fr; gap: var(--space-7); }
}
`;

if (typeof document !== 'undefined' && !document.getElementById('pf-hero-css')) {
  const s = document.createElement('style'); s.id = 'pf-hero-css'; s.textContent = HERO_CSS;
  document.head.appendChild(s);
}

export function Hero() {
  const updated = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  return (
    <header className="pf-hero">
      <div className="pf-hero__wash"></div>
      <div className="pf-hero__inner">
        <Eyebrow dot="accent">{['Portfolio, 2026', 'Los Angeles']}</Eyebrow>
        <h1 className="pf-hero__title">
          Agents that<br />actually <Accent underline>ship</Accent>
        </h1>
        <div className="pf-hero__cols">
          <p className="pf-hero__lead">
            I design, build, and ship production agent systems for the enterprise.
            <span style={{ display: 'block', marginTop: '14px', fontSize: 'var(--text-small)', color: 'var(--text-meta)', lineHeight: 'var(--leading-tight)' }}>Senior Forward Deployed Engineer at Salesforce.</span>
          </p>
          <p className="pf-hero__aside">
            Demos are easy. Production is the job. The gap between a promising
            agent and a dependable one is where I work.
          </p>
        </div>
        <div className="pf-hero__actions">
          <Button href="#work" arrow>View selected work</Button>
          <Button href="#contact" variant="secondary">Get in touch</Button>
        </div>
        <div className="pf-hero__ticker">
          <Ticker items={['Shipping enterprise agent platforms', 'Advising on AI trust and governance', 'Updated ' + updated]} />
        </div>
      </div>
    </header>
  );
}
