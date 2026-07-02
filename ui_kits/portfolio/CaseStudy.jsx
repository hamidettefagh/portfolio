import React from 'react';
import { SiteNav } from './SiteNav.jsx';
import { Eyebrow } from '../../components/primitives/Eyebrow.jsx';
import { Tag } from '../../components/primitives/Tag.jsx';
import { Rule } from '../../components/primitives/Rule.jsx';
import { Button } from '../../components/primitives/Button.jsx';

const CS_CSS = `
.pfc { max-width: 880px; margin: 0 auto; padding: calc(var(--nav-height) + var(--space-11)) var(--gutter) var(--space-11); }
.pfc__title {
  font-family: var(--font-display); font-weight: var(--weight-display);
  font-size: clamp(40px, 5.4vw, 68px); letter-spacing: var(--tracking-display);
  line-height: 1.02; margin: var(--space-6) 0 var(--space-7); text-wrap: balance;
}
.pfc__meta { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: var(--space-10); }
.pfc__label {
  font-family: var(--font-mono); font-size: var(--text-mono);
  letter-spacing: var(--tracking-mono); text-transform: uppercase;
  color: var(--text-accent); display: block; margin: var(--space-10) 0 var(--space-4);
}
.pfc p { font-size: var(--text-body); line-height: var(--leading-body); color: var(--text-body); max-width: var(--measure-body); margin: 0 0 var(--space-4); }
.pfc__todo {
  font-size: var(--text-small); line-height: var(--leading-tight); color: var(--text-faint);
  border: 1px dashed var(--border-strong); border-radius: var(--radius-sm);
  padding: 14px 16px; max-width: var(--measure-body); font-family: var(--font-mono);
}
.pfc__back { margin-top: var(--space-10); }
`;

if (typeof document !== 'undefined' && !document.getElementById('pfc-css')) {
  const s = document.createElement('style'); s.id = 'pfc-css'; s.textContent = CS_CSS;
  document.head.appendChild(s);
}

export function CaseStudy() {
  return (
    <div>
      <SiteNav links={[{ href: 'index.html#work', label: 'All work' }]} />
      <article className="pfc" data-screen-label="Case study">
        <Eyebrow dot="accent">{['Case study', 'Major US airline']}</Eyebrow>
        <h1 className="pfc__title">Airline super agent program</h1>
        <div className="pfc__meta">
          <Tag>Lead engineer</Tag>
          <Tag>Multi-agent platform</Tag>
          <Tag variant="fill">In production</Tag>
        </div>

        <Rule />
        <span className="pfc__label">The situation</span>
        <p>
          A major US airline was taking a multi-agent customer operations platform
          to production, and a critical go-live was failing under executive visibility.
        </p>
        <div className="pfc__todo">Add: what was breaking, scale of the rollout, team shape.</div>

        <span className="pfc__label">The work</span>
        <p>
          As lead forward deployed engineer I stabilized the platform through
          go-live, then co-authored the roadmap for the next-generation agent now in flight.
        </p>
        <div className="pfc__todo">Add: architecture decisions, reliability work, handoff details.</div>

        <span className="pfc__label">The outcome</span>
        <p>A production system, live with customers, and a funded path forward.</p>
        <div className="pfc__todo">Add: shippable metrics you are cleared to share.</div>

        <div className="pfc__back">
          <Button href="index.html#work" variant="secondary">Back to all work</Button>
        </div>
      </article>
    </div>
  );
}
