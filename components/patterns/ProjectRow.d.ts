/**
 * A row in the Selected Work list: index, title, one-line outcome,
 * industry tag, northeast arrow. Rows separate with hairlines, no cards.
 */
export interface ProjectRowProps {
  /** Two-digit index string, e.g. "01" */
  index?: string;
  title: string;
  /** One-line outcome. Industry descriptors only, no client names. */
  summary?: string;
  /** Industry descriptor tag, e.g. "Major US airline" */
  org?: string;
  href?: string;
  onClick?: (e: any) => void;
}
export declare function ProjectRow(props: ProjectRowProps): any;
