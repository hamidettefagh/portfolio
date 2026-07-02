/**
 * Mono uppercase meta label used above headings and in tickers.
 * Pass an array of children to get middot separators between segments.
 */
export interface EyebrowProps {
  /** 'accent' (orange dot) or 'live' (green dot); omit for none */
  dot?: 'accent' | 'live';
  /** Colors the whole label accent orange */
  accent?: boolean;
  children?: any;
}
export declare function Eyebrow(props: EyebrowProps): any;
