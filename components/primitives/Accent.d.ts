/**
 * The signature motif: an italic serif accent word inside an Archivo headline.
 * Use on exactly one word or short phrase per headline, at most once per screen.
 */
export interface AccentProps {
  /** Thick accent-colored underline (hero use) */
  underline?: boolean;
  /** Keep ink color instead of accent orange */
  ink?: boolean;
  children?: any;
}
export declare function Accent(props: AccentProps): any;
