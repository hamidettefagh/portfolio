/**
 * Inline text link with a quiet hairline underline that darkens on hover.
 * External links get a small northeast arrow.
 */
export interface TextLinkProps {
  href?: string;
  /** Accent-colored link; default inherits ink */
  accent?: boolean;
  /** Adds the northeast arrow and target=_blank */
  external?: boolean;
  children?: any;
}
export declare function TextLink(props: TextLinkProps): any;
