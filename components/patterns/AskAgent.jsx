import React from 'react';

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
  const s = document.createElement('style'); s.id = 'ds-ask-css'; s.textContent = ASK_CSS;
  document.head.appendChild(s);
}

const DEFAULT_SYSTEM = [
  'You are the site agent on hamidettefagh.com, the portfolio of Hamid Ettefagh.',
  '',
  'Facts you know:',
  '- Role: Senior Forward Deployed Engineer, AI at Salesforce, based in Los Angeles. He leads production AI deployments for some of the company\u2019s largest enterprise customers: multi-agent systems, RAG pipelines, and the evaluation and observability layers that make them safe to run at scale.',
  '- Airline super agent program: lead forward deployed engineer on a production multi-agent platform serving customer operations for a major US airline. Stabilized a critical go-live under executive visibility and co-authored the roadmap for the next-generation agent now in flight.',
  '- Agent cost and retention optimization for a global dining platform: re-architected the production agent runtime, cutting operating costs by 80 percent and driving more than 1,150 customer reactivations.',
  '- Global deal registration program for a consumer electronics leader: architected the foundational program spanning the US, Japan, and Asia-Pacific, delivered with zero-defect UAT across 17 languages.',
  '- Agentic AI proof of concept for a national telecom carrier: designed and delivered a large-scale agentic PoC with projected material reduction in average handle time.',
  '- InsightForce: AI insight engine prototype, winner of a 63-entry company-wide hackathon, with modeled pipeline impact north of $1B.',
  '- Also advises Fortune 500 teams on AI trust, security, and governance.',
  '- Experience: Salesforce, Senior Forward Deployed Engineer, AI (2025 to present). Salesforce, Senior Technical Architect, Strategic Accounts (2022 to 2025), leading teams of 25+ engineers. Earlier, enterprise delivery roles at Accenture, Deloitte, and Cognizant.',
  '- Credentials: Claude Certified Architect (Anthropic), 17 Salesforce certifications, professional certificate from MIT xPRO.',
  '- Principles: production over demos. Cost is a feature. Trust is architecture.',
  '- Contact: hamid.ettefagh@gmail.com, or LinkedIn.',
  '',
  'Rules:',
  '- Answer in 2 to 4 plain sentences. No lists unless asked.',
  '- Never use em dashes. Never use exclamation points.',
  '- Never name client companies. Use the industry descriptors above, exactly. Salesforce may be named as his employer.',
  '- No exact contract or deal dollar figures. The phrases eight-figure and north of $1B modeled impact are allowed.',
  '- Never share a phone number or street address. Los Angeles is as specific as location gets.',
  '- Do not invent facts. If asked something you do not know about Hamid, say you do not know and suggest emailing hamid.ettefagh@gmail.com.',
  '- Stay on Hamid, his work, and how he works. Politely redirect anything else.',
  '- Refer to Hamid in third person. You are his agent, not him.'
].join('\n');

const DEFAULT_SUGGESTIONS = [
  'What did he do for the airline?',
  'How did he cut agent costs 80 percent?',
  'What does a forward deployed engineer do?'
];

export function AskAgent({ system = DEFAULT_SYSTEM, suggestions = DEFAULT_SUGGESTIONS, focusEventName = 'pf-ask-focus' }) {
  const [query, setQuery] = React.useState('');
  const [answer, setAnswer] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const inputRef = React.useRef(null);
  const available = typeof window !== 'undefined' && window.claude && typeof window.claude.complete === 'function';

  React.useEffect(() => {
    const onFocus = () => { if (inputRef.current) inputRef.current.focus(); };
    window.addEventListener(focusEventName, onFocus);
    return () => window.removeEventListener(focusEventName, onFocus);
  }, [focusEventName]);

  const ask = async (q) => {
    const question = (q || '').trim();
    if (!question || busy) return;
    if (!available) {
      setAnswer({ text: 'The agent is offline in this preview. Email hamid.ettefagh@gmail.com instead.', muted: true });
      return;
    }
    setBusy(true);
    setAnswer(null);
    try {
      const text = await window.claude.complete({
        system: system,
        messages: [{ role: 'user', content: question }],
        max_tokens: 400
      });
      setAnswer({ text: text, muted: false });
    } catch (err) {
      setAnswer({ text: 'The agent hit an error. Try again, or email hamid.ettefagh@gmail.com.', muted: true });
    }
    setBusy(false);
  };

  const onSubmit = (e) => { e.preventDefault(); ask(query); };
  const onSuggestion = (s) => { setQuery(s); ask(s); };

  return (
    <div className="ds-ask">
      <div className="ds-ask__label">
        <span className={'ds-ask__dot' + (busy ? ' ds-ask__dot--busy' : '')}></span>
        <span>{busy ? 'Working' : 'Agent online'}</span>
      </div>
      <form className="ds-ask__row" onSubmit={onSubmit}>
        <input
          ref={inputRef}
          className="ds-ask__input"
          placeholder="Ask about the work"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="ds-ask__send" disabled={busy || !query.trim()}>Ask</button>
      </form>
      <div className="ds-ask__suggestions">
        {suggestions.map((s) => (
          <button key={s} type="button" className="ds-ask__suggestion" onClick={() => onSuggestion(s)}>{s}</button>
        ))}
      </div>
      {answer ? <p className={'ds-ask__answer' + (answer.muted ? ' ds-ask__answer--muted' : '')}>{answer.text}</p> : null}
      <p className="ds-ask__fineprint">Live model output. It can be wrong. For anything that matters, email.</p>
    </div>
  );
}
