/**
 * Pill button. Primary is the single accent-filled action per view;
 * secondary is a hairline outline; ghost is text-only.
 */
export interface ButtonProps {
  /** 'primary' (accent fill) | 'secondary' (outline) | 'ghost' (text) */
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  /** Renders an <a> instead of <button> */
  href?: string;
  target?: string;
  /** Trailing arrow that nudges right on hover */
  arrow?: boolean;
  disabled?: boolean;
  onClick?: (e: any) => void;
  children?: any;
}
export declare function Button(props: ButtonProps): any;
