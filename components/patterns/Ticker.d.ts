/**
 * The NOW strip: mono status items between two strong hairlines.
 * One per page, directly under the hero.
 */
export interface TickerProps {
  /** Left label, default "Now" */
  label?: string;
  /** Green live dot before the label */
  live?: boolean;
  items: string[];
}
export declare function Ticker(props: TickerProps): any;
