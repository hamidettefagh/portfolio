// Two scripted calls for the call replay template: the same request handled by
// a phone menu and by a voice agent. Every line and every time here is written
// by me to show the format. Nothing is a recording or a measurement.

export type Speaker = "menu" | "caller" | "agent" | "person" | "hold";

export type Turn = {
  who: Speaker;
  start: number; // seconds from the start of the call
  end: number;
  text: string;
  note?: string; // what this turn shows: a retry, a barge-in, a tool call
  kind?: "keypad" | "retry" | "bargein" | "tool" | "transfer" | "hold";
};

export type Script = {
  id: "menu" | "agent";
  label: string;
  outcome: string;
  turns: Turn[];
};

export const SPEAKER_LABEL: Record<Speaker, string> = {
  menu: "Phone menu",
  caller: "Caller",
  agent: "Voice agent",
  person: "Person",
  hold: "Hold",
};

export const SCRIPTS: Script[] = [
  {
    id: "menu",
    label: "Phone menu",
    outcome: "Transferred to a person after a hold. The menu could only offer the next open day.",
    turns: [
      { who: "menu", start: 0, end: 6.5, text: "Thanks for calling. For deliveries, press 1. For billing, press 2. For anything else, press 3." },
      { who: "caller", start: 7.4, end: 7.7, text: "(presses 1)", kind: "keypad" },
      { who: "menu", start: 8.6, end: 12.6, text: "Please enter your ten-digit order number, followed by the pound key." },
      { who: "caller", start: 13.5, end: 21.0, text: "(types the order number)", kind: "keypad" },
      {
        who: "menu",
        start: 22.0,
        end: 25.5,
        text: "Sorry, I didn't get that. Please enter your order number.",
        kind: "retry",
        note: "The keypad entry timed out, so the caller starts over.",
      },
      { who: "caller", start: 26.4, end: 33.0, text: "(types it again)", kind: "keypad" },
      { who: "menu", start: 34.0, end: 37.0, text: "To reschedule, press 1. To track your delivery, press 2." },
      { who: "caller", start: 37.8, end: 38.1, text: "(presses 1)", kind: "keypad" },
      {
        who: "menu",
        start: 38.8,
        end: 44.5,
        text: "The next available delivery date is Thursday. To accept, press 1. For more options, press 2.",
        note: "It can offer the next open day, not the day the caller wants.",
      },
      { who: "caller", start: 45.6, end: 45.9, text: "(presses 2)", kind: "keypad" },
      { who: "menu", start: 46.6, end: 49.0, text: "Please hold while I transfer you.", kind: "transfer" },
      { who: "hold", start: 49.0, end: 112.0, text: "(hold music)", kind: "hold" },
      { who: "person", start: 112.5, end: 116.0, text: "Thanks for holding. Can I get your order number?", note: "The person starts from zero." },
      { who: "caller", start: 116.8, end: 122.5, text: "It's the one I already typed in twice." },
      { who: "person", start: 123.2, end: 128.0, text: "Sorry about that. Let me pull it up. What day would you like?" },
      { who: "caller", start: 128.6, end: 130.4, text: "Tomorrow morning, please." },
      { who: "person", start: 131.2, end: 137.8, text: "Done, tomorrow between nine and eleven. You'll get a text." },
    ],
  },
  {
    id: "agent",
    label: "Voice agent",
    outcome: "Resolved on the call. No transfer, no repeats.",
    turns: [
      { who: "agent", start: 0, end: 2.6, text: "Hi, you've reached deliveries. What can I help with?" },
      { who: "caller", start: 3.2, end: 5.4, text: "I need to move my delivery to tomorrow." },
      {
        who: "agent",
        start: 6.7,
        end: 10.2,
        text: "I can help. I see one order on this number, arriving Thursday. Is that the one?",
        note: "Matches the order to the calling number instead of asking for it.",
      },
      { who: "caller", start: 10.7, end: 11.0, text: "Yes." },
      {
        who: "agent",
        start: 12.3,
        end: 13.6,
        text: "One moment while I check tomorrow.",
        kind: "tool",
        note: "Says something the moment it decides to call the scheduling tool.",
      },
      {
        who: "agent",
        start: 15.0,
        end: 16.6,
        text: "Tomorrow I have an afternoon window, from two to...",
        note: "Cut off: the caller talks over it, and it stops.",
        kind: "bargein",
      },
      { who: "caller", start: 16.3, end: 18.0, text: "Is there anything in the morning?" },
      { who: "agent", start: 19.3, end: 21.9, text: "Yes, nine to eleven is open. Want that one?" },
      { who: "caller", start: 22.4, end: 22.9, text: "Perfect." },
      {
        who: "agent",
        start: 24.2,
        end: 29.6,
        text: "Done. Your delivery moves to tomorrow, nine to eleven, and a text is on its way. Anything else?",
      },
      { who: "caller", start: 30.2, end: 30.8, text: "No, thanks." },
      {
        who: "agent",
        start: 31.4,
        end: 32.4,
        text: "Have a good day.",
        note: "A fixed phrase, played from audio rendered ahead of time, so it comes back faster.",
      },
    ],
  },
];

// The gap before each agent or menu turn: how long the caller waited after
// they stopped talking. Only turns that answer a caller turn count.
export function responseGaps(turns: Turn[]) {
  const gaps: { index: number; gap: number }[] = [];
  for (let i = 1; i < turns.length; i++) {
    const t = turns[i];
    const prev = turns[i - 1];
    if ((t.who === "agent" || t.who === "menu" || t.who === "person") && prev.who === "caller") {
      gaps.push({ index: i, gap: Math.max(0, t.start - prev.end) });
    }
  }
  return gaps;
}

export function summarize(s: Script) {
  const end = s.turns[s.turns.length - 1].end;
  return {
    seconds: end,
    callerTurns: s.turns.filter((t) => t.who === "caller").length,
    retries: s.turns.filter((t) => t.kind === "retry").length,
    transfers: s.turns.filter((t) => t.kind === "transfer").length,
    holdSeconds: s.turns.filter((t) => t.kind === "hold").reduce((n, t) => n + (t.end - t.start), 0),
  };
}
