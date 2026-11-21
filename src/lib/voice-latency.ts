// A voice agent's latency budget: the stages one conversational turn passes
// through, the published ranges for each, and four presets. The ranges are
// sourced (see SOURCES); the presets and the bands are my picks inside them,
// not measurements of any product.

export type StageKey = "uplink" | "eot" | "stt" | "llm" | "tool" | "tts" | "s2s" | "downlink";

export type Stage = {
  key: StageKey;
  label: string;
  detail: string;
  min: number;
  max: number;
  range: string;
  sources: number[];
};

export const STAGES: Record<StageKey, Stage> = {
  uplink: {
    key: "uplink",
    label: "The caller's voice reaches the agent",
    detail: "Microphone, encoding, network, and jitter buffer, one way.",
    min: 60,
    max: 500,
    range: "100 to 250 ms on the web, about 115 to 250 on a phone line",
    sources: [8, 7, 15, 5],
  },
  eot: {
    key: "eot",
    label: "Deciding the caller is done",
    detail: "A fixed silence timer, or a model that predicts the end of the turn.",
    min: 100,
    max: 1000,
    range: "about 500 ms for a fixed timer, 250 to 300 for a turn model",
    sources: [11, 12, 10],
  },
  stt: {
    key: "stt",
    label: "The final transcript",
    detail: "What speech to text still owes once the caller stops.",
    min: 20,
    max: 400,
    range: "about 50 to 150 ms for fast streaming models",
    sources: [14, 7],
  },
  llm: {
    key: "llm",
    label: "The model's first token",
    detail: "A fast model, not a reasoning mode. Long prompts push it up; caching pulls it down.",
    min: 100,
    max: 1500,
    range: "250 to 750 ms for fast models",
    sources: [6, 7],
  },
  tool: {
    key: "tool",
    label: "A tool call in the middle",
    detail: "The model writes the call, the backend answers, the model starts again.",
    min: 300,
    max: 3000,
    range: "roughly 900 to 1,100 ms added, with a long tail on the backend",
    sources: [13],
  },
  tts: {
    key: "tts",
    label: "The first audio from speech synthesis",
    detail: "Streaming text to speech, to the first audible sound.",
    min: 50,
    max: 400,
    range: "100 to 250 ms",
    sources: [6, 7],
  },
  s2s: {
    key: "s2s",
    label: "A speech-to-speech model's first audio",
    detail: "One model hears and speaks, with no transcript or synthesis step between.",
    min: 150,
    max: 1000,
    range: "160 to 320 ms in vendor claims, slower where measured",
    sources: [9, 8],
  },
  downlink: {
    key: "downlink",
    label: "The answer reaches the caller",
    detail: "Network back, then the player's buffer.",
    min: 60,
    max: 500,
    range: "90 to 150 ms on the web, more on a phone line",
    sources: [8, 7],
  },
};

export type Preset = {
  id: string;
  label: string;
  arch: "cascade" | "s2s";
  values: Partial<Record<StageKey, number>>;
  tool: boolean;
  note: string;
};

export const PRESETS: Preset[] = [
  {
    id: "web-cascade",
    label: "Web, cascaded",
    arch: "cascade",
    tool: false,
    values: { uplink: 110, eot: 260, stt: 60, llm: 300, tts: 110, downlink: 90 },
    note: "Speech to text, then a fast model, then speech synthesis, all streaming, in a browser over WebRTC.",
  },
  {
    id: "web-s2s",
    label: "Web, speech to speech",
    arch: "s2s",
    tool: false,
    values: { uplink: 110, eot: 500, s2s: 320, downlink: 90 },
    note: "One model hears and speaks. The 320 ms is a 2024 vendor claim that may already include deciding the turn is over, so this may count that stage twice.",
  },
  {
    id: "phone",
    label: "Phone line, cascaded",
    arch: "cascade",
    tool: false,
    values: { uplink: 150, eot: 500, stt: 100, llm: 375, tts: 150, downlink: 150 },
    note: "The same cascade over a phone line: narrowband audio, carrier legs both ways, a fixed silence timer.",
  },
  {
    id: "phone-tool",
    label: "Phone line, with a tool call",
    arch: "cascade",
    tool: true,
    values: { uplink: 150, eot: 500, stt: 100, llm: 375, tool: 925, tts: 150, downlink: 150 },
    note: "The caller asks for something only a backend knows, so the model has to call it before it can answer.",
  },
];

// The part of a tool call the caller cannot avoid even with an acknowledgment:
// the model writing the call. An acknowledgment can start right after it.
export const TOOL_DECISION_MS = 350;

export const MARKS = [
  { at: 200, label: "Human gap", note: "Average pause between turns in conversation" },
  { at: 800, label: "Lag noticed", note: "Where callers start to notice" },
  { at: 1500, label: "Laggy", note: "A common upper target for voice agents" },
];

// My mapping of the thresholds above into four words. Not a standard.
export function band(ms: number): { label: string; note: string } {
  if (ms <= 500) return { label: "Human-like", note: "Inside the range of a natural pause." };
  if (ms <= 800) return { label: "Good", note: "Slower than a person, but most callers will not notice." };
  if (ms <= 1500) return { label: "Noticeable", note: "Callers notice the wait, and some start talking again." };
  return { label: "Laggy", note: "Long enough that silence reads as a dropped call." };
}

export const SOURCES: { n: number; title: string; by: string; year: string; url: string }[] = [
  { n: 1, title: "Universals and cultural variation in turn-taking in conversation", by: "Stivers et al., PNAS", year: "2009", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2705608" },
  { n: 2, title: "Timing in turn-taking and its implications for processing models of language", by: "Levinson and Torreira, Frontiers in Psychology", year: "2015", url: "https://www.frontiersin.org/articles/10.3389/fpsyg.2015.00731/full" },
  { n: 3, title: "Fast response times signal social connection in conversation", by: "Templeton et al., PNAS", year: "2022", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8794835" },
  { n: 4, title: "One-way transmission time (G.114)", by: "ITU-T", year: "2003", url: "https://www.itu.int/rec/T-REC-G.114-200305-I" },
  { n: 5, title: "Latency is a sum, not a number", by: "SignalWire", year: "2026", url: "https://signalwire.com/blog/latency-is-a-sum-not-a-number" },
  { n: 6, title: "A guide to core latency in AI voice agents", by: "Twilio", year: "2025", url: "https://www.twilio.com/en-us/blog/developers/best-practices/guide-core-latency-ai-voice-agents" },
  { n: 7, title: "Voice agent latency optimization", by: "ElevenLabs", year: "2026", url: "https://elevenlabs.io/blog/voice-agent-latency-optimization" },
  { n: 8, title: "Voice AI and voice agents, an illustrated primer", by: "voiceaiandvoiceagents.com", year: "2026", url: "https://voiceaiandvoiceagents.com/" },
  { n: 9, title: "Hello GPT-4o", by: "OpenAI", year: "2024", url: "https://openai.com/index/hello-gpt-4o/" },
  { n: 10, title: "Flux end-of-turn detection", by: "Deepgram docs", year: "2026", url: "https://developers.deepgram.com/docs/flux/voice-agent-eager-eot" },
  { n: 11, title: "Turn handling options", by: "LiveKit docs", year: "2026", url: "https://docs.livekit.io/reference/agents/turn-handling-options/" },
  { n: 12, title: "Realtime client events, server VAD", by: "OpenAI docs", year: "2026", url: "https://developers.openai.com/api/reference/resources/realtime/client-events" },
  { n: 13, title: "A voice agent latency playbook", by: "Hugging Face community blog", year: "2026", url: "https://huggingface.co/blog/dvalle08/voice-agent-latency-playbook" },
  { n: 14, title: "Voice agent latency budget", by: "Soniox", year: "2026", url: "https://soniox.com/wiki/voice-agent-latency-budget" },
  { n: 15, title: "Voice AI latency benchmark", by: "Telnyx", year: "2026", url: "https://telnyx.com/resources/voice-ai-latency-benchmark" },
  { n: 16, title: "Voice AI latency: why pauses read as hesitation", by: "Deepgram", year: "2026", url: "https://deepgram.com/learn/voice-ai-latency-why-pauses-read-as-hesitation" },
];

export const TECHNIQUES: { title: string; body: string; sources: number[] }[] = [
  {
    title: "Stream every stage",
    body: "Hand the model's text to speech synthesis at the first sentence boundary instead of waiting for the whole answer.",
    sources: [7, 6],
  },
  {
    title: "Start before the caller is done",
    body: "Begin generating on a stable partial transcript, and throw the work away if the caller keeps talking. It buys 100 to 200 ms for more model calls.",
    sources: [7, 10],
  },
  {
    title: "Say something while the tool runs",
    body: "An acknowledgment at the moment the model decides to call a tool moves the first sound forward by most of the tool's time.",
    sources: [6, 13],
  },
  {
    title: "Pre-render the fixed phrases",
    body: "Greetings, confirmations, and holds can be audio files instead of synthesis on every call.",
    sources: [13],
  },
  {
    title: "Put the stack next to the audio",
    body: "Run speech, model, and synthesis near where the call's media lands, so the stages do not cross a continent between them.",
    sources: [6, 8],
  },
  {
    title: "Match the phone line",
    body: "On a phone call, use the line's own 8 kHz codec end to end and keep the player's buffer small.",
    sources: [7, 8],
  },
];
