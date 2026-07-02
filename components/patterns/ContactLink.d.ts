/**
 * Large contact row: mono label, big value, hairline top.
 * copyable rows copy the value to clipboard and flash "Copied".
 */
export interface ContactLinkProps {
  /** e.g. "Email" */
  label: string;
  /** e.g. "hamid@ettefagh.ai" */
  value: string;
  href?: string;
  /** Click copies value instead of navigating */
  copyable?: boolean;
}
export declare function ContactLink(props: ContactLinkProps): any;
