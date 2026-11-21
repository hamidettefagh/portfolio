import { ImageResponse } from "next/og";
import { loadArchivo } from "@/lib/og";

// The shared OG card layout: a big title, one line under it, the domain at
// the foot. Same look as the essay's card.
export const OG_SIZE = { width: 1200, height: 630 };

export async function ogCard(title: string, line: string, eyebrow?: string) {
  const archivo = await loadArchivo();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "96px",
          background: "#FDFBF8",
          color: "#211D18",
          fontFamily: archivo ? "Archivo" : "sans-serif",
        }}
      >
        {eyebrow ? (
          <div style={{ fontSize: 26, color: "#B4532A", letterSpacing: "0.08em", marginBottom: 28 }}>
            {eyebrow.toUpperCase()}
          </div>
        ) : null}
        <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1 }}>{title}</div>
        <div
          style={{
            fontSize: 38,
            marginTop: 28,
            color: "#4F4840",
            letterSpacing: "-0.02em",
            lineHeight: 1.3,
            maxWidth: 1008,
          }}
        >
          {line}
        </div>
        <div style={{ position: "absolute", left: 96, bottom: 88, width: 1008, height: 1, background: "#D3CBBD" }} />
        <div style={{ position: "absolute", left: 96, bottom: 52, fontSize: 22, color: "#7D7569" }}>
          hamidettefagh.com
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: archivo ? [{ name: "Archivo", data: archivo, weight: 700 as const }] : undefined,
    },
  );
}
