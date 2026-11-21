// Receipts mode: each figure from the work says what kind of evidence it is,
// and every section says how it was made. The tags render on the server and
// stay hidden until html[data-receipts="on"] is set by the toggle, so turning
// the mode on changes nothing but visibility, and no hooks are needed here.

export type EvidenceKind =
  | "production"
  | "testing"
  | "projection"
  | "count"
  | "computed"
  | "illustrative";

export type SourceKind =
  | "static"
  | "computed"
  | "browser"
  | "server"
  | "recorded"
  | "model"
  | "illustrative";

export const EVIDENCE: Record<EvidenceKind, { label: string; note: string }> = {
  production: { label: "Production", note: "Measured on live traffic" },
  testing: { label: "Testing", note: "Measured in testing, not on live traffic" },
  projection: { label: "Projection", note: "An estimate made before the fact, not a measurement" },
  count: { label: "Count", note: "A tally from the record" },
  computed: { label: "Computed", note: "Calculated by code on this site" },
  illustrative: { label: "Illustrative", note: "An example to show the idea, not data" },
};

export const SOURCES: Record<SourceKind, { label: string; note: string }> = {
  static: { label: "Static text", note: "Written by me, served as is" },
  computed: { label: "Computed at build", note: "Calculated by code when the site is built" },
  browser: { label: "Code in your browser", note: "Deterministic code running on your device, no model" },
  server: { label: "Code on the server", note: "Deterministic code running on the server when asked, no model" },
  recorded: { label: "Recorded run", note: "The raw output of a script run against the live site, unedited" },
  model: { label: "Live model call", note: "Written by a model when you ask" },
  illustrative: { label: "Illustrative", note: "Examples to show the idea, not data" },
};

// A figure in running text, with its evidence class attached.
export function Receipt({
  kind,
  note,
  children,
}: {
  kind: EvidenceKind;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <span className="rcpt" data-kind={kind}>
      {children}
      <ReceiptTag kind={kind} note={note} />
    </span>
  );
}

// The tag on its own, for a whole line rather than one figure.
export function ReceiptTag({ kind, note }: { kind: EvidenceKind; note?: string }) {
  const e = EVIDENCE[kind];
  return (
    <span className="rcpt-tag" data-kind={kind} title={note ?? e.note}>
      <span className="sr-only"> (</span>
      {e.label}
      <span className="sr-only">: {note ?? e.note})</span>
    </span>
  );
}

// How a section of the page is produced.
export function SourceTag({ kind }: { kind: SourceKind }) {
  const s = SOURCES[kind];
  return (
    <span className="src-tag" data-kind={kind} title={s.note}>
      <span className="sr-only">Made by: </span>
      {s.label}
    </span>
  );
}
