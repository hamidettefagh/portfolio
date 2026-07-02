Cmd+K command menu for keyboard-first navigation and quick actions (jump to section, copy email, open LinkedIn). Mount once per page.

```jsx
<CommandMenu items={[
  { label: 'Go to work', hint: '01', action: () => scrollToId('work') },
  { label: 'Copy email', hint: '@', action: copyEmail, confirm: 'Copied' },
  { label: 'Open LinkedIn', hint: String.fromCharCode(8599), action: () => window.open(url) }
]} />
```

Opens on Cmd/Ctrl+K or a `pf-cmdk-open` window event (SiteNav's k-pill dispatches it). `confirm` text flashes in place before the menu closes, for copy actions.
