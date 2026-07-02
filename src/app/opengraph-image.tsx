import { ImageResponse } from "next/og";

// OG image — simple text card in the site palette, per the handoff README.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Hamid Ettefagh, Forward Deployed AI Engineer";

async function loadArchivo(): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(
        "https://fonts.googleapis.com/css2?family=Archivo:wght@700&display=swap",
        { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0)" } },
      )
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

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
          Hamid Ettefagh
        </div>
        <div
          style={{
            fontSize: 40,
            marginTop: 28,
            color: "#4F4840",
            letterSpacing: "-0.02em",
          }}
        >
          Forward Deployed AI Engineer
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
