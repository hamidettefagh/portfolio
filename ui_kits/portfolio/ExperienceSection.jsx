import React from 'react';
import { Rule } from '../../components/primitives/Rule.jsx';
import { ExperienceItem } from '../../components/patterns/ExperienceItem.jsx';

export function ExperienceSection() {
  return (
    <section className="pf-section" id="experience" data-screen-label="Experience">
      <div className="pf-section__head">
        <Rule label="Experience" />
        <h2 className="pf-section__title">Where the work happens</h2>
      </div>
      <div style={{ borderBottom: 'var(--border-w) solid var(--border-hairline)' }}>
        <ExperienceItem
          dates="2025 - Now"
          role="Senior Forward Deployed Engineer, AI"
          org="Salesforce"
          note="Production agent deployments and technical advisory for strategic enterprise accounts."
        />
        <ExperienceItem
          dates="2022 - 2025"
          role="Senior Technical Architect, Strategic Accounts"
          org="Salesforce"
          note="Architecture and delivery leadership across consumer electronics, telecom, and travel programs, leading teams of 25+ engineers."
        />
        <ExperienceItem
          dates="Earlier"
          role="Enterprise delivery roles"
          org="Accenture, Deloitte, and Cognizant"
        />
      </div>
      <div style={{ marginTop: 'var(--space-8)' }}>
        <Rule label="Credentials" />
        <p style={{
          fontSize: 'var(--text-small)', lineHeight: 'var(--leading-tight)',
          color: 'var(--text-secondary)', margin: 'var(--space-5) 0 0', maxWidth: '70ch'
        }}>
          Claude Certified Architect, Anthropic &middot; 17 Salesforce certifications &middot; Professional certificate, MIT xPRO
        </p>
      </div>
    </section>
  );
}
