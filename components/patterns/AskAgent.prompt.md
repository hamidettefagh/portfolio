Inline panel where a live model answers questions about Hamid, grounded in the site's facts and bound by the brand copy rules (no client names, no em dashes, 2 to 4 sentences). The portfolio's signature feature: the site itself demonstrates the job title.

```jsx
<AskAgent />
```

One per site, in its own section. Do not restyle it as a chat bubble or popup. `system` overrides the grounding prompt; keep the rules block if you do. Offline (no model bridge), it degrades to a note pointing at email.
