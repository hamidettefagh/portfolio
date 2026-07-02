import React from 'react';
import { Rule } from '../../components/primitives/Rule.jsx';
import { ContactLink } from '../../components/patterns/ContactLink.jsx';

const CONTACT_CSS = `
.pf-footer {
  margin-top: var(--space-12); padding: var(--space-6) 0 var(--space-8);
  border-top: var(--border-w) solid var(--border-strong);
  display: flex; align-items: baseline; justify-content: space-between; gap: 16px;
}
.pf-footer__name { font-family: var(--font-display); font-weight: var(--weight-heading); font-size: 15px; }
.pf-footer__meta { font-family: var(--font-mono); font-size: var(--text-mono-sm); letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-meta); }
.pf-footer__specs {
  background: none; border: none; padding: 0; cursor: pointer;
  text-decoration: underline; text-underline-offset: 3px;
  text-decoration-color: var(--border-strong);
  transition: color var(--dur-fast) var(--ease-out);
}
.pf-footer__specs:hover { color: var(--text-body); text-decoration-color: currentColor; }
`;

if (typeof document !== 'undefined' && !document.getElementById('pf-contact-css')) {
  const s = document.createElement('style'); s.id = 'pf-contact-css'; s.textContent = CONTACT_CSS;
  document.head.appendChild(s);
}

export function ContactSection() {
  return (
    <section className="pf-section" id="contact" data-screen-label="Contact">
      <div className="pf-section__head">
        <Rule label="Contact" />
        <h2 className="pf-section__title">Get in touch</h2>
      </div>
      <div style={{ borderBottom: 'var(--border-w) solid var(--border-hairline)' }}>
        <ContactLink label="Email" value="hamid.ettefagh@gmail.com" copyable />
        <ContactLink label="LinkedIn" value="in/hamidettefagh" href="https://www.linkedin.com/in/hamidettefagh" />
      </div>
      <footer className="pf-footer">
        <span className="pf-footer__name">Hamid Ettefagh</span>
        <span className="pf-footer__meta">hamidettefagh.com</span>
        <button type="button" className="pf-footer__meta pf-footer__specs" onClick={() => window.dispatchEvent(new Event('pf-specs-open'))}>view specs</button>
        <span className="pf-footer__meta">&copy; 2026</span>
      </footer>
    </section>
  );
}
