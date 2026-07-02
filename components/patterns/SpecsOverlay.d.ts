/**
 * Full-page "view specs" overlay: reads the design tokens off the live page
 * (getComputedStyle) and renders them as a spec sheet. Opens on "." or event.
 */
export interface SpecsOverlayProps {
  /** Window event that opens the overlay, default "pf-specs-open" */
  openEventName?: string;
}
export declare function SpecsOverlay(props: SpecsOverlayProps): any;
