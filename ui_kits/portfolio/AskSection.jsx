import React from 'react';
import { Rule } from '../../components/primitives/Rule.jsx';
import { AskAgent } from '../../components/patterns/AskAgent.jsx';

export function AskSection() {
  return (
    <section className="pf-section" id="ask" data-screen-label="Ask my agent">
      <div className="pf-section__head">
        <Rule label="Ask" />
        <h2 className="pf-section__title">Do not take my word for it.<br />Ask my agent</h2>
      </div>
      <AskAgent />
    </section>
  );
}
