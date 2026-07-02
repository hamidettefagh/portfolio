/**
 * The ask-my-agent panel: a live model answers questions about Hamid's work,
 * grounded in the site's facts and copy rules. Degrades to an offline note.
 */
export interface AskAgentProps {
  /** System prompt override; default carries the site facts and copy rules */
  system?: string;
  /** Clickable starter questions */
  suggestions?: string[];
  /** Window event that focuses the input, default "pf-ask-focus" */
  focusEventName?: string;
}
export declare function AskAgent(props: AskAgentProps): any;
