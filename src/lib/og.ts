// Shared loader for the OG card font. Fetches Archivo 700 from Google Fonts
// at build time; the cards fall back to sans-serif if the fetch fails.
export async function loadArchivo(): Promise<ArrayBuffer | null> {
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
