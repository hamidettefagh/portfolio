import React from 'react';

const CONTACT_CSS = `
.ds-contact {
  display: flex; align-items: baseline; justify-content: space-between; gap: 24px;
  padding: 26px 0; border-top: var(--border-w) solid var(--border-hairline);
  text-decoration: none; color: inherit; cursor: pointer;
}
.ds-contact__label {
  font-family: var(--font-mono); font-size: var(--text-mono);
  letter-spacing: var(--tracking-mono); text-transform: uppercase;
  color: var(--text-meta); flex: none; width: 120px;
}
.ds-contact__value {
  font-family: var(--font-display); font-weight: var(--weight-heading);
  font-size: clamp(20px, 2.4vw, 30px); letter-spacing: var(--tracking-heading);
  flex: 1; transition: color var(--dur-fast) var(--ease-out);
}
.ds-contact:hover .ds-contact__value { color: var(--link-hover); }
.ds-contact__hint {
  font-family: var(--font-mono); font-size: var(--text-mono-sm);
  letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-faint);
  flex: none; transition: color var(--dur-fast) var(--ease-out);
}
.ds-contact:hover .ds-contact__hint { color: var(--text-accent); }
`;

if (typeof document !== 'undefined' && !document.getElementById('ds-contact-css')) {
  const s = document.createElement('style'); s.id = 'ds-contact-css'; s.textContent = CONTACT_CSS;
  document.head.appendChild(s);
}

export function ContactLink({ label, value, href, copyable = false, ...rest }) {
  const [copied, setCopied] = React.useState(false);
  const onClick = (e) => {
    if (!copyable) return;
    e.preventDefault();
    try {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (err) { /* fall through to href */ }
  };
  return (
    <a className="ds-contact" href={href} onClick={onClick}
      target={href && href.startsWith('http') ? '_blank' : undefined}
      rel={href && href.startsWith('http') ? 'noreferrer' : undefined} {...rest}>
      <span className="ds-contact__label">{label}</span>
      <span className="ds-contact__value">{value}</span>
      <span className="ds-contact__hint">{copyable ? (copied ? 'Copied' : 'Click to copy') : String.fromCharCode(8599)}</span>
    </a>
  );
}
