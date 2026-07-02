import React from 'react';
import { Rule } from '../../components/primitives/Rule.jsx';

const ABOUT_CSS = `
.pf-about__body p {
  font-size: var(--text-body); line-height: var(--leading-body);
  color: var(--text-body); max-width: var(--measure-body); margin: 0 0 var(--space-5);
}
.pf-about__principles { margin-top: var(--space-8); display: grid; gap: 0; max-width: 720px; }
.pf-about__principle {
  display: grid; grid-template-columns: 40px 1fr; gap: var(--space-5);
  padding: var(--space-5) 0; border-top: var(--border-w) solid var(--border-hairline);
}
.pf-about__pnum {
  font-family: var(--font-mono); font-size: var(--text-mono);
  color: var(--text-accent); letter-spacing: var(--tracking-mono); padding-top: 2px;
}
.pf-about__ptext { font-size: var(--text-small); line-height: var(--leading-tight); color: var(--text-secondary); margin: 0; max-width: 58ch; }
.pf-about__ptext strong { color: var(--text-body); font-weight: var(--weight-heading); display: block; margin-bottom: 3px; font-size: 16px; }
`;

if (typeof document !== 'undefined' && !document.getElementById('pf-about-css')) {
  const s = document.createElement('style'); s.id = 'pf-about-css'; s.textContent = ABOUT_CSS;
  document.head.appendChild(s);
}

export function AboutSection() {
  return (
    <section className="pf-section" id="about" data-screen-label="About">
      <div className="pf-section__head">
        <Rule label="About" />
        <h2 className="pf-section__title">The gap between<br />pilot and production</h2>
      </div>
      <div className="pf-about__body">
        <p>
          I&rsquo;m a Senior Forward Deployed Engineer at Salesforce, where I lead
          production AI deployments for some of the company&rsquo;s largest enterprise
          customers. My work sits at the intersection of architecture and delivery:
          multi-agent systems, RAG pipelines, and the evaluation and observability
          layers that make them safe to run at scale.
        </p>
        <p>
          Recent work includes leading the engineering of a production multi-agent
          platform for a major US airline, re-architecting an agent runtime for a
          global dining platform to cut operating costs by 80 percent, and advising
          Fortune 500 teams on AI trust, security, and governance. Earlier in my
          career I shipped enterprise programs across consumer electronics, telecom,
          and travel, from strategy through zero-defect delivery.
        </p>
        <p>
          I hold the Claude Certified Architect certification, 17 Salesforce
          certifications, and a professional certificate from MIT xPRO. Based in
          Los Angeles.
        </p>
        <div className="pf-about__principles">
          <div className="pf-about__principle">
            <span className="pf-about__pnum">01</span>
            <p className="pf-about__ptext"><strong>Production over demos</strong>An agent that works in a keynote is not an agent that works at 2am.</p>
          </div>
          <div className="pf-about__principle">
            <span className="pf-about__pnum">02</span>
            <p className="pf-about__ptext"><strong>Cost is a feature</strong>Runtimes should get cheaper as they get smarter.</p>
          </div>
          <div className="pf-about__principle">
            <span className="pf-about__pnum">03</span>
            <p className="pf-about__ptext"><strong>Trust is architecture</strong>Governance belongs in the system design, not the slide deck.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
