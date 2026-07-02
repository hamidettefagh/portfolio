/**
 * Hairline horizontal rule, optionally with a mono label on the left.
 * Hairlines are the system's primary separator; use instead of boxes.
 */
export interface RuleProps {
  /** Mono uppercase label rendered before the line, accent colored */
  label?: string;
  /** Darker hairline */
  strong?: boolean;
}
export declare function Rule(props: RuleProps): any;
