/**
 * Cmd+K command menu: keyboard-first navigation and quick actions.
 * Opens on Cmd/Ctrl+K or the openEventName window event; filter, arrows, enter.
 */
export interface CommandMenuProps {
  /** Actions; confirm (e.g. "Copied") flashes in place before closing */
  items: { label: string; hint?: string; action: () => void; confirm?: string }[];
  /** Window event that opens the menu, default "pf-cmdk-open" */
  openEventName?: string;
}
export declare function CommandMenu(props: CommandMenuProps): any;
