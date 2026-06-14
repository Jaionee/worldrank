// WorldRank API — YouTube Trending Proxy v2
// Obtiene datos reales del trending de YouTube via scraping
// Vercel Serverless Function (Node.js)

// Fallback: videos reales que existen en YouTube
const FALLBACK = [
  { position: 1, title: "Beast Games — Season 2 Episodio 1", meta: "📺 MrBeast · YouTube Trending", trend: "▶️", url: "https://youtube.com/watch?v=k3-VbHekdxE" },
  { position: 2, title: "Último en salir del supermercado gana $250.000", meta: "📺 MrBeast · YouTube Trending", trend: "▶️", url: "https://youtube.com/watch?v=zRtGL0-5rg4" },
  { position: 3, title: "Shakira, Burna Boy — Dai Dai (Video Oficial)", meta: "📺 Shakira · YouTube Trending", trend: "▶️", url: "https://youtube.com/watch?v=fcnDmrtj6Sk" },
  { position: 4, title: "Probé todas las tendencias de moda viral", meta: "📺 FashionTrends · YouTube Trending", trend: "▶️", url: "https://youtube.com/watch?v=CEuwFT2FGBs" },
  { position: 5, title: "MrBeast en TIME100 Summit 2026", meta: "📺 TIME · YouTube Trending", trend: "▶️", url: "https://youtube.com/watch?v=hwGsbLKxit4" },
  { position: 6, title: "El imperio multimillonario de MrBeast", meta: "📺 Documental · YouTube Trending", trend: "▶️", url: "https://youtube.com/watch?v=8sEOV-r7yFI" },
  { position: 7, title: "Beast Games S2 — Tráiler Oficial", meta: "📺 Prime Video · YouTube Trending", trend: "▶️", url: "https://youtube.com/watch?v=RUaoJQ4ZfLY" },
  { position: 8, title: "Music Mix 2026 — Mejores Remixes", meta: "📺 Music Channel · YouTube Trending", trend: "▶️", url: "https://youtube.com/watch?v=C-VH__p_TKM" },
  { position: 9, title: "Vybz Kartel — 2026 (Video Oficial)", meta: "📺 Vybz Kartel · YouTube Trending", trend: "▶️", url: "https://youtube.com/watch?v=RetXTfsEawE" },
  { position: 10, title: "$1 vs $1.000.000.000 — Tech Futurista", meta: "📺 MrBeast · YouTube Trending", trend: "▶️", url: "https://youtube.com/watch?v=pAnGwRiQ4-4" },
];

// Consultas para buscar trending real
const SEARCH_QUERIES = [
  "trending music 2026",
  "viral video 2026",
  "trending today 2026",
];

async function fetchYouTubeTrending() {
  // Intentar múltiples consultas hasta obtener datos
  for (const query of SEARCH_QUERIES) {
    try {
      const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=CAMSAhAB`;
      const resp = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
        },
        signal: AbortSignal.timeout(8000),
      });

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const html = await resp.text();

      // Extraer ytInitialData
      const match = html.match(/ytInitialData\s*=\s*({.*?});\s*<\/script>/);
      if (!match) throw new Error("No ytInitialData found");

      const data = JSON.parse(match[1]);

      // Navegar el árbol para encontrar videoRenderer entries
      const videos = [];
      const sections = [
        data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents,
        data?.contents?.sectionListRenderer?.contents,
      ];

      for (const section of sections) {
        if (!section) continue;
        for (const item of section) {
          const items = item?.itemSectionRenderer?.contents || [];
          for (const content of items) {
            const vr = content?.videoRenderer;
            if (!vr || !vr.videoId) continue;

            const title = vr.title?.runs?.[0]?.text
              || vr.title?.simpleText
              || "Sin título";
            const author = vr.ownerText?.runs?.[0]?.text
              || vr?.longBylineText?.runs?.[0]?.text
              || "YouTube";
            const views = vr.viewCountText?.simpleText
              || vr.viewCountText?.runs?.[0]?.text
              || "";
            // Quitar "vistas" o "views" del texto
            const viewCount = views.replace(/[^0-9.]/g, "").trim();
            const metaViews = viewCount ? `👁️ ${viewCount} vistas` : "📺 YouTube Trending";

            videos.push({
              position: videos.length + 1,
              title: title.slice(0, 80),
              meta: `📺 ${author} · ${metaViews}`,
              trend: "▶️",
              url: `https://youtube.com/watch?v=${vr.videoId}`,
            });

            if (videos.length >= 10) break;
          }
          if (videos.length >= 10) break;
        }
        if (videos.length >= 10) break;
      }

      if (videos.length >= 5) {
        return { source: "youtube", fallback: false, data: videos.slice(0, 10) };
      }
    } catch (e) {
      console.error(`Query "${query}" failed:`, e.message);
      continue;
    }
  }

  // Si todo falla, devolver fallback
  return { source: "youtube", fallback: true, data: FALLBACK };
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
  res.setHeader("Content-Type", "application/json");

  try {
    const result = await fetchYouTubeTrending();
    result.generated = new Date().toISOString();
    res.json(result);
  } catch (e) {
    console.error("YouTube critical error:", e.message);
    res.json({
      source: "youtube",
      fallback: true,
      data: FALLBACK,
      error: e.message,
      generated: new Date().toISOString(),
    });
  }
};
