import { ImageResponse } from "next/og";
import { loadArchivo } from "@/lib/og";

// Per-page OG card for the essay, same layout as the root card with the
// page's own words in place of the byline.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "The two gates, an essay by Hamid Ettefagh";

export default async function Image() {
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
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: "-0.035em",
            lineHeight: 1,
          }}
        >
          The two gates
        </div>
        <div
          style={{
            fontSize: 40,
            marginTop: 28,
            color: "#4F4840",
            letterSpacing: "-0.02em",
            lineHeight: 1.3,
            maxWidth: 1008,
          }}
        >
          The first decides what to build. The second decides whether it is
          ready to run.
        </div>
        <div
          style={{
            position: "absolute",
            left: 96,
            bottom: 88,
            width: 1008,
            height: 1,
            background: "#D3CBBD",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 96,
            bottom: 52,
            fontSize: 22,
            color: "#7D7569",
          }}
        >
          hamidettefagh.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: archivo
        ? [{ name: "Archivo", data: archivo, weight: 700 as const }]
        : undefined,
    },
  );
}
