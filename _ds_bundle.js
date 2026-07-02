/* @ds-bundle: {"format":3,"namespace":"EttefaghDesignSystem_c42bc3","components":[{"name":"AskAgent","sourcePath":"components/patterns/AskAgent.jsx"},{"name":"CommandMenu","sourcePath":"components/patterns/CommandMenu.jsx"},{"name":"ContactLink","sourcePath":"components/patterns/ContactLink.jsx"},{"name":"ExperienceItem","sourcePath":"components/patterns/ExperienceItem.jsx"},{"name":"ProjectRow","sourcePath":"components/patterns/ProjectRow.jsx"},{"name":"SpecsOverlay","sourcePath":"components/patterns/SpecsOverlay.jsx"},{"name":"Ticker","sourcePath":"components/patterns/Ticker.jsx"},{"name":"Accent","sourcePath":"components/primitives/Accent.jsx"},{"name":"Button","sourcePath":"components/primitives/Button.jsx"},{"name":"Eyebrow","sourcePath":"components/primitives/Eyebrow.jsx"},{"name":"Rule","sourcePath":"components/primitives/Rule.jsx"},{"name":"Tag","sourcePath":"components/primitives/Tag.jsx"},{"name":"TextLink","sourcePath":"components/primitives/TextLink.jsx"},{"name":"AboutSection","sourcePath":"ui_kits/portfolio/AboutSection.jsx"},{"name":"AskSection","sourcePath":"ui_kits/portfolio/AskSection.jsx"},{"name":"CaseStudy","sourcePath":"ui_kits/portfolio/CaseStudy.jsx"},{"name":"ContactSection","sourcePath":"ui_kits/portfolio/ContactSection.jsx"},{"name":"ExperienceSection","sourcePath":"ui_kits/portfolio/ExperienceSection.jsx"},{"name":"Hero","sourcePath":"ui_kits/portfolio/Hero.jsx"},{"name":"Home","sourcePath":"ui_kits/portfolio/Home.jsx"},{"name":"Reveal","sourcePath":"ui_kits/portfolio/Reveal.jsx"},{"name":"SiteNav","sourcePath":"ui_kits/portfolio/SiteNav.jsx"},{"name":"WORK_ITEMS","sourcePath":"ui_kits/portfolio/WorkSection.jsx"},{"name":"WorkSection","sourcePath":"ui_kits/portfolio/WorkSection.jsx"}],"sourceHashes":{"components/patterns/AskAgent.jsx":"450f0b2adf5b","components/patterns/CommandMenu.jsx":"1416f044cecd","components/patterns/ContactLink.jsx":"8aa357a72876","components/patterns/ExperienceItem.jsx":"b848680288c8","components/patterns/ProjectRow.jsx":"0cb0f5a89317","components/patterns/SpecsOverlay.jsx":"f98d1dfe9517","components/patterns/Ticker.jsx":"45d1e3fefd75","components/primitives/Accent.jsx":"d25a97128c64","components/primitives/Button.jsx":"24289a7f4f2d","components/primitives/Eyebrow.jsx":"4f32eb1a8e98","components/primitives/Rule.jsx":"3d032118f2a4","components/primitives/Tag.jsx":"c51eb4d8821f","components/primitives/TextLink.jsx":"3eeb90caa884","ui_kits/portfolio/AboutSection.jsx":"18987920966d","ui_kits/portfolio/AskSection.jsx":"e5e1bef306b3","ui_kits/portfolio/CaseStudy.jsx":"f42fac77a124","ui_kits/portfolio/ContactSection.jsx":"f14d419584a3","ui_kits/portfolio/ExperienceSection.jsx":"dfdea4843bac","ui_kits/portfolio/Hero.jsx":"6911f2ae1528","ui_kits/portfolio/Home.jsx":"e694a886315f","ui_kits/portfolio/Reveal.jsx":"7a10e4f81210","ui_kits/portfolio/SiteNav.jsx":"b36bc2a6d9b9","ui_kits/portfolio/WorkSection.jsx":"274aef4888df"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.EttefaghDesignSystem_c42bc3 = window.EttefaghDesignSystem_c42bc3 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/patterns/AskAgent.jsx
try { (() => {
const ASK_CSS = `
.ds-ask {
  background: var(--surface-raised);
  border: var(--border-w) solid var(--border-hairline);
  border-radius: var(--radius-md);
  padding: 24px;
}
.ds-ask__label {
  font-family: var(--font-mono); font-size: var(--text-mono-sm);
  letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-meta);
  display: flex; align-items: center; gap: 8px; margin-bottom: 16px;
}
.ds-ask__dot { width: 7px; height: 7px; border-radius: 50%; background: var(--live); flex: none; }
.ds-ask__dot--busy { animation: ds-ask-pulse 1.1s ease-in-out infinite; }
@keyframes ds-ask-pulse { 50% { opacity: 0.3; } }
.ds-ask__row { display: flex; gap: 10px; }
.ds-ask__input {
  flex: 1; min-width: 0; border: var(--border-w) solid var(--border-strong);
  border-radius: var(--radius-pill); background: var(--surface-page);
  font-family: var(--font-body); font-size: 16px; color: var(--text-body);
  padding: 12px 20px; outline: none; letter-spacing: var(--tracking-body);
  transition: border-color var(--dur-fast) var(--ease-out);
}
.ds-ask__input:focus { border-color: var(--ink-900); }
.ds-ask__input::placeholder { color: var(--text-faint); }
.ds-ask__send {
  font-family: var(--font-body); font-weight: var(--weight-medium); font-size: 16px;
  line-height: 1; padding: 12px 24px; border-radius: var(--radius-pill);
  border: none; cursor: pointer; white-space: nowrap;
  background: var(--accent-600); color: var(--text-on-accent);
  transition: background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out);
}
.ds-ask__send:hover { background: var(--accent-700); }
.ds-ask__send:active { transform: translateY(1px); }
.ds-ask__send[disabled] { opacity: 0.45; pointer-events: none; }
.ds-ask__suggestions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
.ds-ask__suggestion {
  font-family: var(--font-mono); font-size: var(--text-mono-sm);
  letter-spacing: 0.04em; color: var(--text-secondary);
  border: var(--border-w) solid var(--border-hairline); border-radius: var(--radius-pill);
  background: transparent; padding: 6px 12px; cursor: pointer; line-height: 1.3;
  transition: border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
}
.ds-ask__suggestion:hover { border-color: var(--border-strong); color: var(--text-body); }
.ds-ask__answer {
  margin: 18px 0 0; padding-top: 18px;
  border-top: var(--border-w) solid var(--border-hairline);
  font-size: var(--text-body); line-height: var(--leading-body); color: var(--text-body);
  max-width: 62ch; white-space: pre-wrap;
}
.ds-ask__answer--muted { color: var(--text-meta); }
.ds-ask__fineprint {
  margin: 14px 0 0; font-family: var(--font-mono); font-size: 10.5px;
  letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-faint);
}
`;
if (typeof document !== 'undefined' && !document.getElementById('ds-ask-css')) {
  const s = document.createElement('style');
  s.id = 'ds-ask-css';
  s.textContent = ASK_CSS;
  document.head.appendChild(s);
}
const DEFAULT_SYSTEM = ['You are the site agent on hamidettefagh.com, the portfolio of Hamid Ettefagh.', '', 'Facts you know:', '- Role: Senior Forward Deployed Engineer, AI at Salesforce, based in Los Angeles. He leads production AI deployments for some of the company\u2019s largest enterprise customers: multi-agent systems, RAG pipelines, and the evaluation and observability layers that make them safe to run at scale.', '- Airline super agent program: lead forward deployed engineer on a production multi-agent platform serving customer operations for a major US airline. Stabilized a critical go-live under executive visibility and co-authored the roadmap for the next-generation agent now in flight.', '- Agent cost and retention optimization for a global dining platform: re-architected the production agent runtime, cutting operating costs by 80 percent and driving more than 1,150 customer reactivations.', '- Global deal registration program for a consumer electronics leader: architected the foundational program spanning the US, Japan, and Asia-Pacific, delivered with zero-defect UAT across 17 languages.', '- Agentic AI proof of concept for a national telecom carrier: designed and delivered a large-scale agentic PoC with projected material reduction in average handle time.', '- InsightForce: AI insight engine prototype, winner of a 63-entry company-wide hackathon, with modeled pipeline impact north of $1B.', '- Also advises Fortune 500 teams on AI trust, security, and governance.', '- Experience: Salesforce, Senior Forward Deployed Engineer, AI (2025 to present). Salesforce, Senior Technical Architect, Strategic Accounts (2022 to 2025), leading teams of 25+ engineers. Earlier, enterprise delivery roles at Accenture, Deloitte, and Cognizant.', '- Credentials: Claude Certified Architect (Anthropic), 17 Salesforce certifications, professional certificate from MIT xPRO.', '- Principles: production over demos. Cost is a feature. Trust is architecture.', '- Contact: hamid.ettefagh@gmail.com, or LinkedIn.', '', 'Rules:', '- Answer in 2 to 4 plain sentences. No lists unless asked.', '- Never use em dashes. Never use exclamation points.', '- Never name client companies. Use the industry descriptors above, exactly. Salesforce may be named as his employer.', '- No exact contract or deal dollar figures. The phrases eight-figure and north of $1B modeled impact are allowed.', '- Never share a phone number or street address. Los Angeles is as specific as location gets.', '- Do not invent facts. If asked something you do not know about Hamid, say you do not know and suggest emailing hamid.ettefagh@gmail.com.', '- Stay on Hamid, his work, and how he works. Politely redirect anything else.', '- Refer to Hamid in third person. You are his agent, not him.'].join('\n');
const DEFAULT_SUGGESTIONS = ['What did he do for the airline?', 'How did he cut agent costs 80 percent?', 'What does a forward deployed engineer do?'];
function AskAgent({
  system = DEFAULT_SYSTEM,
  suggestions = DEFAULT_SUGGESTIONS,
  focusEventName = 'pf-ask-focus'
}) {
  const [query, setQuery] = React.useState('');
  const [answer, setAnswer] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const inputRef = React.useRef(null);
  const available = typeof window !== 'undefined' && window.claude && typeof window.claude.complete === 'function';
  React.useEffect(() => {
    const onFocus = () => {
      if (inputRef.current) inputRef.current.focus();
    };
    window.addEventListener(focusEventName, onFocus);
    return () => window.removeEventListener(focusEventName, onFocus);
  }, [focusEventName]);
  const ask = async q => {
    const question = (q || '').trim();
    if (!question || busy) return;
    if (!available) {
      setAnswer({
        text: 'The agent is offline in this preview. Email hamid.ettefagh@gmail.com instead.',
        muted: true
      });
      return;
    }
    setBusy(true);
    setAnswer(null);
    try {
      const text = await window.claude.complete({
        system: system,
        messages: [{
          role: 'user',
          content: question
        }],
        max_tokens: 400
      });
      setAnswer({
        text: text,
        muted: false
      });
    } catch (err) {
      setAnswer({
        text: 'The agent hit an error. Try again, or email hamid.ettefagh@gmail.com.',
        muted: true
      });
    }
    setBusy(false);
  };
  const onSubmit = e => {
    e.preventDefault();
    ask(query);
  };
  const onSuggestion = s => {
    setQuery(s);
    ask(s);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ds-ask"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-ask__label"
  }, /*#__PURE__*/React.createElement("span", {
    className: 'ds-ask__dot' + (busy ? ' ds-ask__dot--busy' : '')
  }), /*#__PURE__*/React.createElement("span", null, busy ? 'Working' : 'Agent online')), /*#__PURE__*/React.createElement("form", {
    className: "ds-ask__row",
    onSubmit: onSubmit
  }, /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    className: "ds-ask__input",
    placeholder: "Ask about the work",
    value: query,
    onChange: e => setQuery(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "ds-ask__send",
    disabled: busy || !query.trim()
  }, "Ask")), /*#__PURE__*/React.createElement("div", {
    className: "ds-ask__suggestions"
  }, suggestions.map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    type: "button",
    className: "ds-ask__suggestion",
    onClick: () => onSuggestion(s)
  }, s))), answer ? /*#__PURE__*/React.createElement("p", {
    className: 'ds-ask__answer' + (answer.muted ? ' ds-ask__answer--muted' : '')
  }, answer.text) : null, /*#__PURE__*/React.createElement("p", {
    className: "ds-ask__fineprint"
  }, "Live model output. It can be wrong. For anything that matters, email."));
}
Object.assign(__ds_scope, { AskAgent });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/AskAgent.jsx", error: String((e && e.message) || e) }); }

// components/patterns/CommandMenu.jsx
try { (() => {
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
  const s = document.createElement('style');
  s.id = 'ds-cmdk-css';
  s.textContent = CMDK_CSS;
  document.head.appendChild(s);
}
function CommandMenu({
  items = [],
  openEventName = 'pf-cmdk-open'
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState(0);
  const [flash, setFlash] = React.useState(null);
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    const onKey = e => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setOpen(o => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener(openEventName, onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(openEventName, onOpen);
    };
  }, [openEventName]);
  React.useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      setFlash(null);
      const t = setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 30);
      return () => clearTimeout(t);
    }
  }, [open]);
  const filtered = items.filter(it => it.label.toLowerCase().includes(query.toLowerCase()));
  const run = item => {
    item.action();
    if (item.confirm) {
      setFlash({
        label: item.label,
        text: item.confirm
      });
      setTimeout(() => setOpen(false), 900);
    } else {
      setOpen(false);
    }
  };
  const onInputKey = e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(a => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(a => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && filtered[active]) {
      e.preventDefault();
      run(filtered[active]);
    }
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ds-cmdk__scrim",
    onClick: () => setOpen(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: "ds-cmdk",
    role: "dialog",
    "aria-label": "Command menu"
  }, /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    className: "ds-cmdk__input",
    placeholder: "Where to?",
    value: query,
    onChange: e => {
      setQuery(e.target.value);
      setActive(0);
    },
    onKeyDown: onInputKey
  }), /*#__PURE__*/React.createElement("div", {
    className: "ds-cmdk__list"
  }, filtered.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "ds-cmdk__empty"
  }, "Nothing matches.") : null, filtered.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: it.label,
    className: 'ds-cmdk__item' + (i === active ? ' ds-cmdk__item--active' : ''),
    onMouseEnter: () => setActive(i),
    onClick: () => run(it)
  }, /*#__PURE__*/React.createElement("span", null, flash && flash.label === it.label ? flash.text : it.label), /*#__PURE__*/React.createElement("span", {
    className: "ds-cmdk__hint"
  }, it.hint)))), /*#__PURE__*/React.createElement("div", {
    className: "ds-cmdk__footer"
  }, /*#__PURE__*/React.createElement("span", null, "\u2191\u2193 navigate"), /*#__PURE__*/React.createElement("span", null, "\u21B5 select"), /*#__PURE__*/React.createElement("span", null, "esc close"))));
}
Object.assign(__ds_scope, { CommandMenu });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/CommandMenu.jsx", error: String((e && e.message) || e) }); }

// components/patterns/ContactLink.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  const s = document.createElement('style');
  s.id = 'ds-contact-css';
  s.textContent = CONTACT_CSS;
  document.head.appendChild(s);
}
function ContactLink({
  label,
  value,
  href,
  copyable = false,
  ...rest
}) {
  const [copied, setCopied] = React.useState(false);
  const onClick = e => {
    if (!copyable) return;
    e.preventDefault();
    try {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (err) {/* fall through to href */}
  };
  return /*#__PURE__*/React.createElement("a", _extends({
    className: "ds-contact",
    href: href,
    onClick: onClick,
    target: href && href.startsWith('http') ? '_blank' : undefined,
    rel: href && href.startsWith('http') ? 'noreferrer' : undefined
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "ds-contact__label"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "ds-contact__value"
  }, value), /*#__PURE__*/React.createElement("span", {
    className: "ds-contact__hint"
  }, copyable ? copied ? 'Copied' : 'Click to copy' : String.fromCharCode(8599)));
}
Object.assign(__ds_scope, { ContactLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/ContactLink.jsx", error: String((e && e.message) || e) }); }

// components/patterns/ExperienceItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const EXP_CSS = `
.ds-exp {
  display: grid; grid-template-columns: 160px 1fr; gap: 24px;
  padding: 22px 0; border-top: var(--border-w) solid var(--border-hairline);
}
.ds-exp__dates {
  font-family: var(--font-mono); font-size: var(--text-mono);
  letter-spacing: var(--tracking-mono); text-transform: uppercase;
  color: var(--text-meta); padding-top: 3px;
}
.ds-exp__role {
  font-family: var(--font-display); font-weight: var(--weight-heading);
  font-size: 19px; letter-spacing: var(--tracking-heading); margin: 0;
}
.ds-exp__org { color: var(--text-secondary); font-size: var(--text-small); margin: 4px 0 0; }
.ds-exp__note { color: var(--text-meta); font-size: var(--text-small); margin: 8px 0 0; line-height: var(--leading-tight); max-width: 60ch; }
.ds-exp--placeholder .ds-exp__role, .ds-exp--placeholder .ds-exp__dates { color: var(--text-faint); }
.ds-exp--placeholder { border-top-style: dashed; }
@media (max-width: 720px) { .ds-exp { grid-template-columns: 1fr; gap: 6px; } }
`;
if (typeof document !== 'undefined' && !document.getElementById('ds-exp-css')) {
  const s = document.createElement('style');
  s.id = 'ds-exp-css';
  s.textContent = EXP_CSS;
  document.head.appendChild(s);
}
function ExperienceItem({
  dates,
  role,
  org,
  note,
  placeholder = false,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: 'ds-exp' + (placeholder ? ' ds-exp--placeholder' : '')
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "ds-exp__dates"
  }, dates), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("h3", {
    className: "ds-exp__role"
  }, role), org ? /*#__PURE__*/React.createElement("p", {
    className: "ds-exp__org"
  }, org) : null, note ? /*#__PURE__*/React.createElement("p", {
    className: "ds-exp__note"
  }, note) : null));
}
Object.assign(__ds_scope, { ExperienceItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/ExperienceItem.jsx", error: String((e && e.message) || e) }); }

// components/patterns/ProjectRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const ROW_CSS = `
.ds-projectrow {
  display: grid; grid-template-columns: 56px 1fr auto 28px;
  gap: 24px; align-items: baseline;
  padding: 28px 0; border-top: var(--border-w) solid var(--border-hairline);
  cursor: pointer; text-decoration: none; color: inherit;
}
.ds-projectrow__index {
  font-family: var(--font-mono); font-size: var(--text-mono);
  color: var(--text-faint); letter-spacing: var(--tracking-mono);
}
.ds-projectrow__title {
  font-family: var(--font-display); font-weight: var(--weight-heading);
  font-size: 24px; letter-spacing: var(--tracking-heading);
  line-height: var(--leading-heading); margin: 0;
  transition: color var(--dur-fast) var(--ease-out);
}
.ds-projectrow:hover .ds-projectrow__title { color: var(--link-hover); }
.ds-projectrow__summary {
  margin: 8px 0 0; font-size: var(--text-small); color: var(--text-secondary);
  line-height: var(--leading-tight); max-width: 56ch;
}
.ds-projectrow__org { justify-self: end; align-self: center; }
.ds-projectrow__arrow {
  font-size: 18px; color: var(--text-faint); align-self: center; justify-self: end;
  transition: transform var(--dur-base) var(--ease-out), color var(--dur-fast) var(--ease-out);
}
.ds-projectrow:hover .ds-projectrow__arrow { transform: translate(2px, -2px); color: var(--link-hover); }
@media (max-width: 720px) {
  .ds-projectrow { grid-template-columns: 1fr 28px; }
  .ds-projectrow__index, .ds-projectrow__org { display: none; }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('ds-projectrow-css')) {
  const s = document.createElement('style');
  s.id = 'ds-projectrow-css';
  s.textContent = ROW_CSS;
  document.head.appendChild(s);
}
function ProjectRow({
  index,
  title,
  summary,
  org,
  href = '#',
  onClick,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("a", _extends({
    className: "ds-projectrow",
    href: href,
    onClick: onClick
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "ds-projectrow__index"
  }, index), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("h3", {
    className: "ds-projectrow__title"
  }, title), summary ? /*#__PURE__*/React.createElement("p", {
    className: "ds-projectrow__summary"
  }, summary) : null), org ? /*#__PURE__*/React.createElement("span", {
    className: "ds-projectrow__org"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-tag",
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-mono-sm)',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)',
      border: 'var(--border-w) solid var(--border-hairline)',
      borderRadius: 'var(--radius-pill)',
      padding: '5px 11px',
      lineHeight: 1,
      whiteSpace: 'nowrap',
      display: 'inline-flex'
    }
  }, org)) : null, /*#__PURE__*/React.createElement("span", {
    className: "ds-projectrow__arrow",
    "aria-hidden": "true"
  }, "\u2197"));
}
Object.assign(__ds_scope, { ProjectRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/ProjectRow.jsx", error: String((e && e.message) || e) }); }

// components/patterns/SpecsOverlay.jsx
try { (() => {
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
  const s = document.createElement('style');
  s.id = 'ds-specs-css';
  s.textContent = SPECS_CSS;
  document.head.appendChild(s);
}
const COLOR_TOKENS = ['--paper-0', '--paper-1', '--paper-2', '--line-1', '--line-2', '--ink-300', '--ink-500', '--ink-700', '--ink-900', '--accent-050', '--accent-100', '--accent-500', '--accent-600', '--accent-700', '--live'];
const TYPE_TOKENS = [{
  name: '--text-hero',
  sample: 'Agents that ship',
  px: 40,
  weight: 700,
  tight: true
}, {
  name: '--text-h2',
  sample: 'Selected work',
  px: 30,
  weight: 700,
  tight: true
}, {
  name: '--text-h3',
  sample: 'Airline super agent program',
  px: 24,
  weight: 600,
  tight: true
}, {
  name: '--text-lead',
  sample: 'Production agent systems for the enterprise',
  px: 20,
  weight: 400
}, {
  name: '--text-body',
  sample: 'Demos are easy. Production is the job.',
  px: 17,
  weight: 400
}, {
  name: '--text-small',
  sample: 'Captions and footnotes',
  px: 15,
  weight: 400
}, {
  name: '--text-mono',
  sample: 'META LABELS AND TICKERS',
  px: 13,
  mono: true
}];
const SPACE_TOKENS = ['--space-1', '--space-2', '--space-3', '--space-4', '--space-5', '--space-6', '--space-7', '--space-8', '--space-9', '--space-10', '--space-11', '--space-12', '--space-13'];
const MISC_TOKENS = ['--font-display', '--font-serif', '--font-mono', '--container', '--gutter', '--radius-sm', '--radius-md', '--radius-pill', '--ease-out', '--dur-fast', '--dur-base', '--dur-slow'];
function SpecsOverlay({
  openEventName = 'pf-specs-open'
}) {
  const [open, setOpen] = React.useState(false);
  const [tokens, setTokens] = React.useState({});
  React.useEffect(() => {
    const onKey = e => {
      const t = e.target;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (e.key === '.' && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setOpen(o => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener(openEventName, onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(openEventName, onOpen);
    };
  }, [openEventName]);
  React.useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    const cs = getComputedStyle(document.documentElement);
    const all = {};
    COLOR_TOKENS.concat(SPACE_TOKENS, MISC_TOKENS, TYPE_TOKENS.map(t => t.name)).forEach(n => {
      all[n] = cs.getPropertyValue(n).trim();
    });
    setTokens(all);
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "ds-specs",
    role: "dialog",
    "aria-label": "Design specs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-specs__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-specs__head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-specs__title"
  }, "Specs \xB7 living tokens, read from this page at runtime"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ds-specs__close",
    onClick: () => setOpen(false)
  }, "esc")), /*#__PURE__*/React.createElement("div", {
    className: "ds-specs__section"
  }, "Type"), TYPE_TOKENS.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.name,
    className: "ds-specs__row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-specs__name"
  }, t.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: t.mono ? 'var(--font-mono)' : 'var(--font-display)',
      fontSize: t.px + 'px',
      fontWeight: t.weight || 400,
      letterSpacing: t.tight ? 'var(--tracking-heading)' : t.mono ? 'var(--tracking-mono)' : 'var(--tracking-body)',
      lineHeight: 1.1,
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    }
  }, t.sample), /*#__PURE__*/React.createElement("span", {
    className: "ds-specs__value"
  }, tokens[t.name]))), /*#__PURE__*/React.createElement("div", {
    className: "ds-specs__section"
  }, "Color"), COLOR_TOKENS.map(n => /*#__PURE__*/React.createElement("div", {
    key: n,
    className: "ds-specs__row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-specs__name"
  }, n), /*#__PURE__*/React.createElement("span", {
    className: "ds-specs__swatch",
    style: {
      background: 'var(' + n + ')'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "ds-specs__value"
  }, tokens[n]))), /*#__PURE__*/React.createElement("div", {
    className: "ds-specs__section"
  }, "Spacing"), SPACE_TOKENS.map(n => /*#__PURE__*/React.createElement("div", {
    key: n,
    className: "ds-specs__row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-specs__name"
  }, n), /*#__PURE__*/React.createElement("span", {
    className: "ds-specs__bar",
    style: {
      width: tokens[n]
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "ds-specs__value"
  }, tokens[n]))), /*#__PURE__*/React.createElement("div", {
    className: "ds-specs__section"
  }, "Face, layout, motion"), MISC_TOKENS.map(n => /*#__PURE__*/React.createElement("div", {
    key: n,
    className: "ds-specs__row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ds-specs__name"
  }, n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '11.5px',
      color: 'var(--text-secondary)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, tokens[n]), /*#__PURE__*/React.createElement("span", {
    className: "ds-specs__value"
  })))));
}
Object.assign(__ds_scope, { SpecsOverlay });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/SpecsOverlay.jsx", error: String((e && e.message) || e) }); }

// components/patterns/Ticker.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TICKER_CSS = `
.ds-ticker {
  border-top: var(--border-w) solid var(--border-strong);
  border-bottom: var(--border-w) solid var(--border-strong);
  padding: 14px 0;
  display: flex; align-items: center; gap: 32px;
  overflow: hidden;
}
.ds-ticker__label {
  font-family: var(--font-mono); font-size: var(--text-mono);
  letter-spacing: var(--tracking-mono); text-transform: uppercase;
  color: var(--text-accent); flex: none; display: inline-flex; align-items: center; gap: 8px;
}
.ds-ticker__dot { width: 7px; height: 7px; border-radius: 50%; background: var(--live); }
.ds-ticker__items { display: flex; gap: 40px; flex-wrap: wrap; }
.ds-ticker__item {
  font-family: var(--font-mono); font-size: var(--text-mono);
  letter-spacing: 0.04em; color: var(--text-secondary); white-space: nowrap;
}
`;
if (typeof document !== 'undefined' && !document.getElementById('ds-ticker-css')) {
  const s = document.createElement('style');
  s.id = 'ds-ticker-css';
  s.textContent = TICKER_CSS;
  document.head.appendChild(s);
}
function Ticker({
  label = 'Now',
  live = true,
  items = [],
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "ds-ticker"
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "ds-ticker__label"
  }, live ? /*#__PURE__*/React.createElement("span", {
    className: "ds-ticker__dot",
    "aria-hidden": "true"
  }) : null, label), /*#__PURE__*/React.createElement("span", {
    className: "ds-ticker__items"
  }, items.map((it, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "ds-ticker__item"
  }, it))));
}
Object.assign(__ds_scope, { Ticker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/Ticker.jsx", error: String((e && e.message) || e) }); }

// components/primitives/Accent.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const ACCENT_CSS = `
.ds-accent {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: var(--serif-accent-weight);
  letter-spacing: -0.01em;
  color: var(--text-accent);
}
.ds-accent--underline {
  text-decoration: underline;
  text-decoration-thickness: var(--underline-thickness-hero);
  text-underline-offset: var(--underline-offset);
  text-decoration-color: var(--accent-500);
}
.ds-accent--ink { color: inherit; }
`;
if (typeof document !== 'undefined' && !document.getElementById('ds-accent-css')) {
  const s = document.createElement('style');
  s.id = 'ds-accent-css';
  s.textContent = ACCENT_CSS;
  document.head.appendChild(s);
}
function Accent({
  underline = false,
  ink = false,
  children,
  ...rest
}) {
  const cls = 'ds-accent' + (underline ? ' ds-accent--underline' : '') + (ink ? ' ds-accent--ink' : '');
  return /*#__PURE__*/React.createElement("em", _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Accent });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/primitives/Accent.jsx", error: String((e && e.message) || e) }); }

// components/primitives/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const BTN_CSS = `
.ds-btn {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-body); font-weight: var(--weight-medium);
  letter-spacing: -0.01em; line-height: 1;
  border-radius: var(--radius-pill); cursor: pointer;
  text-decoration: none; border: var(--border-w) solid transparent;
  white-space: nowrap;
  transition: background var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out),
    transform var(--dur-fast) var(--ease-out);
}
.ds-btn:active { transform: translateY(1px); }
.ds-btn--md { font-size: 16px; padding: 14px 26px; }
.ds-btn--sm { font-size: 14px; padding: 10px 18px; }
.ds-btn--primary { background: var(--accent-600); color: var(--text-on-accent); }
.ds-btn--primary:hover { background: var(--accent-700); }
.ds-btn--secondary { background: transparent; color: var(--text-body); border-color: var(--border-strong); }
.ds-btn--secondary:hover { border-color: var(--ink-900); }
.ds-btn--ghost { background: transparent; color: var(--text-body); padding-left: 6px; padding-right: 6px; }
.ds-btn--ghost:hover { color: var(--link-hover); }
.ds-btn[disabled] { opacity: 0.45; pointer-events: none; }
.ds-btn__arrow { font-family: var(--font-body); transition: transform var(--dur-base) var(--ease-out); display: inline-block; }
.ds-btn:hover .ds-btn__arrow { transform: translateX(3px); }
`;
if (typeof document !== 'undefined' && !document.getElementById('ds-btn-css')) {
  const s = document.createElement('style');
  s.id = 'ds-btn-css';
  s.textContent = BTN_CSS;
  document.head.appendChild(s);
}
function Button({
  variant = 'primary',
  size = 'md',
  href,
  target,
  arrow = false,
  children,
  ...rest
}) {
  const cls = 'ds-btn ds-btn--' + variant + ' ds-btn--' + size;
  const inner = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, children), arrow ? /*#__PURE__*/React.createElement("span", {
    className: "ds-btn__arrow",
    "aria-hidden": "true"
  }, "\u2192") : null);
  if (href) {
    return /*#__PURE__*/React.createElement("a", _extends({
      className: cls,
      href: href,
      target: target,
      rel: target === '_blank' ? 'noreferrer' : undefined
    }, rest), inner);
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: cls
  }, rest), inner);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/primitives/Button.jsx", error: String((e && e.message) || e) }); }

// components/primitives/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const EYEBROW_CSS = `
.ds-eyebrow {
  font-family: var(--font-mono); font-size: var(--text-mono);
  letter-spacing: var(--tracking-mono); text-transform: uppercase;
  color: var(--text-meta); display: inline-flex; align-items: center; gap: 10px;
  font-weight: 400;
}
.ds-eyebrow--accent { color: var(--text-accent); }
.ds-eyebrow__dot {
  width: 7px; height: 7px; border-radius: 50%; flex: none;
}
.ds-eyebrow__sep { color: var(--text-faint); }
`;
if (typeof document !== 'undefined' && !document.getElementById('ds-eyebrow-css')) {
  const s = document.createElement('style');
  s.id = 'ds-eyebrow-css';
  s.textContent = EYEBROW_CSS;
  document.head.appendChild(s);
}
function Eyebrow({
  dot,
  accent = false,
  children,
  ...rest
}) {
  const items = Array.isArray(children) ? children : [children];
  const parts = [];
  items.forEach((c, i) => {
    if (i > 0) parts.push(/*#__PURE__*/React.createElement("span", {
      key: 's' + i,
      className: "ds-eyebrow__sep",
      "aria-hidden": "true"
    }, "\xB7"));
    parts.push(/*#__PURE__*/React.createElement("span", {
      key: 'c' + i
    }, c));
  });
  return /*#__PURE__*/React.createElement("span", _extends({
    className: 'ds-eyebrow' + (accent ? ' ds-eyebrow--accent' : '')
  }, rest), dot ? /*#__PURE__*/React.createElement("span", {
    className: "ds-eyebrow__dot",
    style: {
      background: dot === 'live' ? 'var(--live)' : 'var(--accent-500)'
    },
    "aria-hidden": "true"
  }) : null, parts);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/primitives/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/primitives/Rule.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const RULE_CSS = `
.ds-rule { display: flex; align-items: center; gap: 16px; }
.ds-rule__line { flex: 1; height: 0; border-top: var(--border-w) solid var(--border-hairline); }
.ds-rule--strong .ds-rule__line { border-top-color: var(--border-strong); }
.ds-rule__label {
  font-family: var(--font-mono); font-size: var(--text-mono);
  letter-spacing: var(--tracking-mono); text-transform: uppercase;
  color: var(--text-accent); flex: none;
}
`;
if (typeof document !== 'undefined' && !document.getElementById('ds-rule-css')) {
  const s = document.createElement('style');
  s.id = 'ds-rule-css';
  s.textContent = RULE_CSS;
  document.head.appendChild(s);
}
function Rule({
  label,
  strong = false,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: 'ds-rule' + (strong ? ' ds-rule--strong' : ''),
    role: "separator"
  }, rest), label ? /*#__PURE__*/React.createElement("span", {
    className: "ds-rule__label"
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    className: "ds-rule__line"
  }));
}
Object.assign(__ds_scope, { Rule });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/primitives/Rule.jsx", error: String((e && e.message) || e) }); }

// components/primitives/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TAG_CSS = `
.ds-tag {
  display: inline-flex; align-items: center;
  font-family: var(--font-mono); font-size: var(--text-mono-sm);
  letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--text-secondary);
  border: var(--border-w) solid var(--border-hairline);
  border-radius: var(--radius-pill);
  padding: 5px 11px; line-height: 1; white-space: nowrap;
}
.ds-tag--fill { background: var(--surface-inset); border-color: transparent; }
.ds-tag--accent { color: var(--text-accent); border-color: var(--accent-100); background: var(--accent-050); }
`;
if (typeof document !== 'undefined' && !document.getElementById('ds-tag-css')) {
  const s = document.createElement('style');
  s.id = 'ds-tag-css';
  s.textContent = TAG_CSS;
  document.head.appendChild(s);
}
function Tag({
  variant = 'outline',
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: 'ds-tag' + (variant !== 'outline' ? ' ds-tag--' + variant : '')
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/primitives/Tag.jsx", error: String((e && e.message) || e) }); }

// components/primitives/TextLink.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  const s = document.createElement('style');
  s.id = 'ds-link-css';
  s.textContent = LINK_CSS;
  document.head.appendChild(s);
}
function TextLink({
  href = '#',
  accent = false,
  external = false,
  children,
  ...rest
}) {
  const cls = 'ds-link' + (accent ? ' ds-link--accent' : '');
  return /*#__PURE__*/React.createElement("a", _extends({
    className: cls,
    href: href,
    target: external ? '_blank' : undefined,
    rel: external ? 'noreferrer' : undefined
  }, rest), children, external ? /*#__PURE__*/React.createElement("span", {
    className: "ds-link__ext",
    "aria-hidden": "true"
  }, "\u2197") : null);
}
Object.assign(__ds_scope, { TextLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/primitives/TextLink.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/AboutSection.jsx
try { (() => {
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
  const s = document.createElement('style');
  s.id = 'pf-about-css';
  s.textContent = ABOUT_CSS;
  document.head.appendChild(s);
}
function AboutSection() {
  return /*#__PURE__*/React.createElement("section", {
    className: "pf-section",
    id: "about",
    "data-screen-label": "About"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-section__head"
  }, /*#__PURE__*/React.createElement(__ds_scope.Rule, {
    label: "About"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "pf-section__title"
  }, "The gap between", /*#__PURE__*/React.createElement("br", null), "pilot and production")), /*#__PURE__*/React.createElement("div", {
    className: "pf-about__body"
  }, /*#__PURE__*/React.createElement("p", null, "I\u2019m a Senior Forward Deployed Engineer at Salesforce, where I lead production AI deployments for some of the company\u2019s largest enterprise customers. My work sits at the intersection of architecture and delivery: multi-agent systems, RAG pipelines, and the evaluation and observability layers that make them safe to run at scale."), /*#__PURE__*/React.createElement("p", null, "Recent work includes leading the engineering of a production multi-agent platform for a major US airline, re-architecting an agent runtime for a global dining platform to cut operating costs by 80 percent, and advising Fortune 500 teams on AI trust, security, and governance. Earlier in my career I shipped enterprise programs across consumer electronics, telecom, and travel, from strategy through zero-defect delivery."), /*#__PURE__*/React.createElement("p", null, "I hold the Claude Certified Architect certification, 17 Salesforce certifications, and a professional certificate from MIT xPRO. Based in Los Angeles."), /*#__PURE__*/React.createElement("div", {
    className: "pf-about__principles"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-about__principle"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-about__pnum"
  }, "01"), /*#__PURE__*/React.createElement("p", {
    className: "pf-about__ptext"
  }, /*#__PURE__*/React.createElement("strong", null, "Production over demos"), "An agent that works in a keynote is not an agent that works at 2am.")), /*#__PURE__*/React.createElement("div", {
    className: "pf-about__principle"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-about__pnum"
  }, "02"), /*#__PURE__*/React.createElement("p", {
    className: "pf-about__ptext"
  }, /*#__PURE__*/React.createElement("strong", null, "Cost is a feature"), "Runtimes should get cheaper as they get smarter.")), /*#__PURE__*/React.createElement("div", {
    className: "pf-about__principle"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-about__pnum"
  }, "03"), /*#__PURE__*/React.createElement("p", {
    className: "pf-about__ptext"
  }, /*#__PURE__*/React.createElement("strong", null, "Trust is architecture"), "Governance belongs in the system design, not the slide deck.")))));
}
Object.assign(__ds_scope, { AboutSection });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/AboutSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/AskSection.jsx
try { (() => {
function AskSection() {
  return /*#__PURE__*/React.createElement("section", {
    className: "pf-section",
    id: "ask",
    "data-screen-label": "Ask my agent"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-section__head"
  }, /*#__PURE__*/React.createElement(__ds_scope.Rule, {
    label: "Ask"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "pf-section__title"
  }, "Do not take my word for it.", /*#__PURE__*/React.createElement("br", null), "Ask my agent")), /*#__PURE__*/React.createElement(__ds_scope.AskAgent, null));
}
Object.assign(__ds_scope, { AskSection });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/AskSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/ContactSection.jsx
try { (() => {
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
  const s = document.createElement('style');
  s.id = 'pf-contact-css';
  s.textContent = CONTACT_CSS;
  document.head.appendChild(s);
}
function ContactSection() {
  return /*#__PURE__*/React.createElement("section", {
    className: "pf-section",
    id: "contact",
    "data-screen-label": "Contact"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-section__head"
  }, /*#__PURE__*/React.createElement(__ds_scope.Rule, {
    label: "Contact"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "pf-section__title"
  }, "Get in touch")), /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: 'var(--border-w) solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ContactLink, {
    label: "Email",
    value: "hamid.ettefagh@gmail.com",
    copyable: true
  }), /*#__PURE__*/React.createElement(__ds_scope.ContactLink, {
    label: "LinkedIn",
    value: "in/hamidettefagh",
    href: "https://www.linkedin.com/in/hamidettefagh"
  })), /*#__PURE__*/React.createElement("footer", {
    className: "pf-footer"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-footer__name"
  }, "Hamid Ettefagh"), /*#__PURE__*/React.createElement("span", {
    className: "pf-footer__meta"
  }, "hamidettefagh.com"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pf-footer__meta pf-footer__specs",
    onClick: () => window.dispatchEvent(new Event('pf-specs-open'))
  }, "view specs"), /*#__PURE__*/React.createElement("span", {
    className: "pf-footer__meta"
  }, "\xA9 2026")));
}
Object.assign(__ds_scope, { ContactSection });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/ContactSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/ExperienceSection.jsx
try { (() => {
function ExperienceSection() {
  return /*#__PURE__*/React.createElement("section", {
    className: "pf-section",
    id: "experience",
    "data-screen-label": "Experience"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-section__head"
  }, /*#__PURE__*/React.createElement(__ds_scope.Rule, {
    label: "Experience"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "pf-section__title"
  }, "Where the work happens")), /*#__PURE__*/React.createElement("div", {
    style: {
      borderBottom: 'var(--border-w) solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ExperienceItem, {
    dates: "2025 - Now",
    role: "Senior Forward Deployed Engineer, AI",
    org: "Salesforce",
    note: "Production agent deployments and technical advisory for strategic enterprise accounts."
  }), /*#__PURE__*/React.createElement(__ds_scope.ExperienceItem, {
    dates: "2022 - 2025",
    role: "Senior Technical Architect, Strategic Accounts",
    org: "Salesforce",
    note: "Architecture and delivery leadership across consumer electronics, telecom, and travel programs, leading teams of 25+ engineers."
  }), /*#__PURE__*/React.createElement(__ds_scope.ExperienceItem, {
    dates: "Earlier",
    role: "Enterprise delivery roles",
    org: "Accenture, Deloitte, and Cognizant"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Rule, {
    label: "Credentials"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-small)',
      lineHeight: 'var(--leading-tight)',
      color: 'var(--text-secondary)',
      margin: 'var(--space-5) 0 0',
      maxWidth: '70ch'
    }
  }, "Claude Certified Architect, Anthropic \xB7 17 Salesforce certifications \xB7 Professional certificate, MIT xPRO")));
}
Object.assign(__ds_scope, { ExperienceSection });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/ExperienceSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/Hero.jsx
try { (() => {
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
  const s = document.createElement('style');
  s.id = 'pf-hero-css';
  s.textContent = HERO_CSS;
  document.head.appendChild(s);
}
function Hero() {
  const updated = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
  return /*#__PURE__*/React.createElement("header", {
    className: "pf-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-hero__wash"
  }), /*#__PURE__*/React.createElement("div", {
    className: "pf-hero__inner"
  }, /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, {
    dot: "accent"
  }, ['Portfolio, 2026', 'Los Angeles']), /*#__PURE__*/React.createElement("h1", {
    className: "pf-hero__title"
  }, "Agents that", /*#__PURE__*/React.createElement("br", null), "actually ", /*#__PURE__*/React.createElement(__ds_scope.Accent, {
    underline: true
  }, "ship")), /*#__PURE__*/React.createElement("div", {
    className: "pf-hero__cols"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pf-hero__lead"
  }, "I design, build, and ship production agent systems for the enterprise.", /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginTop: '14px',
      fontSize: 'var(--text-small)',
      color: 'var(--text-meta)',
      lineHeight: 'var(--leading-tight)'
    }
  }, "Senior Forward Deployed Engineer at Salesforce.")), /*#__PURE__*/React.createElement("p", {
    className: "pf-hero__aside"
  }, "Demos are easy. Production is the job. The gap between a promising agent and a dependable one is where I work.")), /*#__PURE__*/React.createElement("div", {
    className: "pf-hero__actions"
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    href: "#work",
    arrow: true
  }, "View selected work"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    href: "#contact",
    variant: "secondary"
  }, "Get in touch")), /*#__PURE__*/React.createElement("div", {
    className: "pf-hero__ticker"
  }, /*#__PURE__*/React.createElement(__ds_scope.Ticker, {
    items: ['Shipping enterprise agent platforms', 'Advising on AI trust and governance', 'Updated ' + updated]
  }))));
}
Object.assign(__ds_scope, { Hero });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/Reveal.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Reveal({
  delay = 0,
  children,
  style,
  ...rest
}) {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);
  const [instant, setInstant] = React.useState(false);
  React.useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = ref.current;
    if (reduce || !el || typeof IntersectionObserver === 'undefined') {
      setInstant(true);
      setShown(true);
      return;
    }
    let io = null;
    let ioFired = false;
    // IO spec mandates an initial callback for every observed element.
    // If none arrives (broken in some embedded contexts), show content
    // immediately WITHOUT a transition: a frozen animation clock would
    // otherwise hold the CSSTransition at offset 0 forever.
    const fallback = setTimeout(() => {
      if (!ioFired) {
        setInstant(true);
        setShown(true);
      }
    }, 350);
    try {
      io = new IntersectionObserver(entries => {
        ioFired = true;
        entries.forEach(e => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      }, {
        threshold: 0.12
      });
      io.observe(el);
    } catch (err) {
      setInstant(true);
      setShown(true);
    }
    return () => {
      clearTimeout(fallback);
      if (io) io.disconnect();
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: ref,
    style: {
      opacity: shown ? 1 : 0,
      transform: shown ? 'none' : 'translateY(14px)',
      transition: instant ? 'none' : 'opacity var(--dur-slow) var(--ease-out) ' + delay + 'ms, transform var(--dur-slow) var(--ease-out) ' + delay + 'ms',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Reveal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/Reveal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/SiteNav.jsx
try { (() => {
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
  const s = document.createElement('style');
  s.id = 'pf-nav-css';
  s.textContent = NAV_CSS;
  document.head.appendChild(s);
}
function SiteNav({
  mark = 'hamidettefagh.com',
  links = [],
  cmdk = false,
  onNavigate
}) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const go = (e, href) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
    if (onNavigate) onNavigate(href);
  };
  return /*#__PURE__*/React.createElement("nav", {
    className: 'pf-nav' + (scrolled ? ' pf-nav--scrolled' : '')
  }, /*#__PURE__*/React.createElement("a", {
    className: "pf-nav__mark",
    href: "index.html"
  }, mark), /*#__PURE__*/React.createElement("div", {
    className: "pf-nav__links"
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.href,
    className: "pf-nav__link",
    href: l.href,
    onClick: e => go(e, l.href)
  }, l.label)), cmdk ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pf-nav__cmdk",
    title: "Command menu",
    onClick: () => window.dispatchEvent(new Event('pf-cmdk-open'))
  }, "\u2318K") : null));
}
Object.assign(__ds_scope, { SiteNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/SiteNav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/CaseStudy.jsx
try { (() => {
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
  const s = document.createElement('style');
  s.id = 'pfc-css';
  s.textContent = CS_CSS;
  document.head.appendChild(s);
}
function CaseStudy() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(__ds_scope.SiteNav, {
    links: [{
      href: 'index.html#work',
      label: 'All work'
    }]
  }), /*#__PURE__*/React.createElement("article", {
    className: "pfc",
    "data-screen-label": "Case study"
  }, /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, {
    dot: "accent"
  }, ['Case study', 'Major US airline']), /*#__PURE__*/React.createElement("h1", {
    className: "pfc__title"
  }, "Airline super agent program"), /*#__PURE__*/React.createElement("div", {
    className: "pfc__meta"
  }, /*#__PURE__*/React.createElement(__ds_scope.Tag, null, "Lead engineer"), /*#__PURE__*/React.createElement(__ds_scope.Tag, null, "Multi-agent platform"), /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    variant: "fill"
  }, "In production")), /*#__PURE__*/React.createElement(__ds_scope.Rule, null), /*#__PURE__*/React.createElement("span", {
    className: "pfc__label"
  }, "The situation"), /*#__PURE__*/React.createElement("p", null, "A major US airline was taking a multi-agent customer operations platform to production, and a critical go-live was failing under executive visibility."), /*#__PURE__*/React.createElement("div", {
    className: "pfc__todo"
  }, "Add: what was breaking, scale of the rollout, team shape."), /*#__PURE__*/React.createElement("span", {
    className: "pfc__label"
  }, "The work"), /*#__PURE__*/React.createElement("p", null, "As lead forward deployed engineer I stabilized the platform through go-live, then co-authored the roadmap for the next-generation agent now in flight."), /*#__PURE__*/React.createElement("div", {
    className: "pfc__todo"
  }, "Add: architecture decisions, reliability work, handoff details."), /*#__PURE__*/React.createElement("span", {
    className: "pfc__label"
  }, "The outcome"), /*#__PURE__*/React.createElement("p", null, "A production system, live with customers, and a funded path forward."), /*#__PURE__*/React.createElement("div", {
    className: "pfc__todo"
  }, "Add: shippable metrics you are cleared to share."), /*#__PURE__*/React.createElement("div", {
    className: "pfc__back"
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    href: "index.html#work",
    variant: "secondary"
  }, "Back to all work"))));
}
Object.assign(__ds_scope, { CaseStudy });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/CaseStudy.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/WorkSection.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const WORK_ITEMS = [{
  index: '01',
  title: 'Airline super agent program',
  summary: 'Lead forward deployed engineer on a production multi-agent platform serving customer operations. Stabilized a critical go-live under executive visibility and co-authored the roadmap for the next-generation agent now in flight.',
  org: 'Major US airline'
}, {
  index: '02',
  title: 'Agent cost and retention optimization',
  summary: 'Re-architected the production agent runtime, cutting operating costs by 80 percent and driving more than 1,150 customer reactivations.',
  org: 'Global dining platform'
}, {
  index: '03',
  title: 'Global deal registration program',
  summary: 'Architected the foundational program spanning the US, Japan, and Asia-Pacific, delivered with zero-defect UAT across 17 languages.',
  org: 'Consumer electronics leader'
}, {
  index: '04',
  title: 'Agentic AI proof of concept',
  summary: 'Designed and delivered a large-scale agentic proof of concept with projected material reduction in average handle time.',
  org: 'National telecom carrier'
}, {
  index: '05',
  title: 'InsightForce',
  summary: 'AI insight engine prototype. Winner of a 63-entry company-wide hackathon, with modeled pipeline impact north of $1B.',
  org: 'Internal innovation'
}];
const WORK_CSS = `
.pf-section { padding: var(--space-12) 0 0; }
.pf-section__head { margin-bottom: var(--space-8); }
.pf-section__title {
  font-family: var(--font-display); font-weight: var(--weight-display);
  font-size: var(--text-h2); letter-spacing: var(--tracking-heading);
  line-height: 1.05; margin: var(--space-6) 0 0;
}
.pf-work__list { border-bottom: var(--border-w) solid var(--border-hairline); }
`;
if (typeof document !== 'undefined' && !document.getElementById('pf-work-css')) {
  const s = document.createElement('style');
  s.id = 'pf-work-css';
  s.textContent = WORK_CSS;
  document.head.appendChild(s);
}
function WorkSection({
  detailHref = 'project.html'
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "pf-section",
    id: "work",
    "data-screen-label": "Selected work"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-section__head"
  }, /*#__PURE__*/React.createElement(__ds_scope.Rule, {
    label: "Selected work"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "pf-section__title"
  }, "Five engagements, one job:", /*#__PURE__*/React.createElement("br", null), "make it real")), /*#__PURE__*/React.createElement("div", {
    className: "pf-work__list"
  }, WORK_ITEMS.map(w => /*#__PURE__*/React.createElement(__ds_scope.ProjectRow, _extends({
    key: w.index
  }, w, {
    href: w.index === '01' ? detailHref : undefined
  })))));
}
Object.assign(__ds_scope, { WORK_ITEMS, WorkSection });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/WorkSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/Home.jsx
try { (() => {
const HOME_CSS = `
.pf-container { max-width: var(--container); margin: 0 auto; padding: 0 var(--gutter); }
.pf-home { padding-bottom: 0; }
`;
if (typeof document !== 'undefined' && !document.getElementById('pf-home-css')) {
  const s = document.createElement('style');
  s.id = 'pf-home-css';
  s.textContent = HOME_CSS;
  document.head.appendChild(s);
}
function Home() {
  const scrollToId = id => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 84;
    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  };
  const EMAIL = 'hamid.ettefagh@gmail.com';
  const commands = [{
    label: 'Go to work',
    hint: '01',
    action: () => scrollToId('work')
  }, {
    label: 'Ask my agent',
    hint: 'AI',
    action: () => {
      scrollToId('ask');
      setTimeout(() => window.dispatchEvent(new Event('pf-ask-focus')), 450);
    }
  }, {
    label: 'Go to about',
    hint: '02',
    action: () => scrollToId('about')
  }, {
    label: 'Go to experience',
    hint: '03',
    action: () => scrollToId('experience')
  }, {
    label: 'Go to contact',
    hint: '04',
    action: () => scrollToId('contact')
  }, {
    label: 'Copy email',
    hint: '@',
    action: () => {
      try {
        navigator.clipboard.writeText(EMAIL);
      } catch (e) {/* noop */}
    },
    confirm: 'Copied ' + EMAIL
  }, {
    label: 'View specs',
    hint: '.',
    action: () => window.dispatchEvent(new Event('pf-specs-open'))
  }, {
    label: 'Open LinkedIn',
    hint: String.fromCharCode(8599),
    action: () => window.open('https://www.linkedin.com/in/hamidettefagh', '_blank')
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "pf-home"
  }, /*#__PURE__*/React.createElement(__ds_scope.SiteNav, {
    cmdk: true,
    links: [{
      href: '#work',
      label: 'Work'
    }, {
      href: '#about',
      label: 'About'
    }, {
      href: '#experience',
      label: 'Experience'
    }, {
      href: '#contact',
      label: 'Contact'
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "pf-container"
  }, /*#__PURE__*/React.createElement(__ds_scope.Hero, null), /*#__PURE__*/React.createElement(__ds_scope.Reveal, null, /*#__PURE__*/React.createElement(__ds_scope.WorkSection, null)), /*#__PURE__*/React.createElement(__ds_scope.Reveal, null, /*#__PURE__*/React.createElement(__ds_scope.AskSection, null)), /*#__PURE__*/React.createElement(__ds_scope.Reveal, null, /*#__PURE__*/React.createElement(__ds_scope.AboutSection, null)), /*#__PURE__*/React.createElement(__ds_scope.Reveal, null, /*#__PURE__*/React.createElement(__ds_scope.ExperienceSection, null)), /*#__PURE__*/React.createElement(__ds_scope.Reveal, null, /*#__PURE__*/React.createElement(__ds_scope.ContactSection, null))), /*#__PURE__*/React.createElement(__ds_scope.CommandMenu, {
    items: commands
  }), /*#__PURE__*/React.createElement(__ds_scope.SpecsOverlay, null));
}
Object.assign(__ds_scope, { Home });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/Home.jsx", error: String((e && e.message) || e) }); }

__ds_ns.AskAgent = __ds_scope.AskAgent;

__ds_ns.CommandMenu = __ds_scope.CommandMenu;

__ds_ns.ContactLink = __ds_scope.ContactLink;

__ds_ns.ExperienceItem = __ds_scope.ExperienceItem;

__ds_ns.ProjectRow = __ds_scope.ProjectRow;

__ds_ns.SpecsOverlay = __ds_scope.SpecsOverlay;

__ds_ns.Ticker = __ds_scope.Ticker;

__ds_ns.Accent = __ds_scope.Accent;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Rule = __ds_scope.Rule;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.TextLink = __ds_scope.TextLink;

__ds_ns.AboutSection = __ds_scope.AboutSection;

__ds_ns.AskSection = __ds_scope.AskSection;

__ds_ns.CaseStudy = __ds_scope.CaseStudy;

__ds_ns.ContactSection = __ds_scope.ContactSection;

__ds_ns.ExperienceSection = __ds_scope.ExperienceSection;

__ds_ns.Hero = __ds_scope.Hero;

__ds_ns.Home = __ds_scope.Home;

__ds_ns.Reveal = __ds_scope.Reveal;

__ds_ns.SiteNav = __ds_scope.SiteNav;

__ds_ns.WORK_ITEMS = __ds_scope.WORK_ITEMS;

__ds_ns.WorkSection = __ds_scope.WorkSection;

})();
