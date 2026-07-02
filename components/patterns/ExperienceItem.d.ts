/**
 * Resume row: mono dates column, role, org descriptor, optional note.
 * Set placeholder for rows awaiting real data (dashed hairline, faint text).
 */
export interface ExperienceItemProps {
  /** e.g. "2024 - Now" */
  dates: string;
  role: string;
  org?: string;
  note?: string;
  /** Dashed, faint styling for rows awaiting real data */
  placeholder?: boolean;
}
export declare function ExperienceItem(props: ExperienceItemProps): any;
