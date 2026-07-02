import React from 'react';

const LINK_CSS = `
.ds-link {
  color: inherit; cursor: pointer;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-decoration-color: var(--border-strong);
  transition: color var(--dur-fast) var(--ease-out),
    text-decoration-color var(--dur-fast) var(--ease-out);
}
.ds-link:hover { color: var(--link-hover); text-decoration-color: currentColor; }
.ds-link--accent { color: var(--link); text-decoration-color: var(--accent-100); }
.ds-link--accent:hover { color: var(--link-hover); }
.ds-link__ext {
  font-size: 0.75em; margin-left: 0.15em; text-decoration: none;
  display: inline-block; transition: transform var(--dur-base) var(--ease-out);
}
.ds-link:hover .ds-link__ext { transform: translate(2px, -2px); }
`;

if (typeof document !== 'undefined' && !document.getElementById('ds-link-css')) {
  const s = document.createElement('style'); s.id = 'ds-link-css'; s.textContent = LINK_CSS;
  document.head.appendChild(s);
}

export function TextLink({ href = '#', accent = false, external = false, children, ...rest }) {
  const cls = 'ds-link' + (accent ? ' ds-link--accent' : '');
  return (
    <a
      className={cls}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      {...rest}
    >
      {children}
      {external ? <span className="ds-link__ext" aria-hidden="true">&#8599;</span> : null}
    </a>
  );
}
