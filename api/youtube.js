// WorldRank API — YouTube Trending Proxy
// Vercel Serverless Function (Node.js)

const YT_RSS = "https://www.youtube.com/feeds/videos.xml?chart=most_popular&hl=es&gl=ES";

const fallback = [
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

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");

  try {
    const resp = await fetch(YT_RSS, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; WorldRank/1.0)", Accept: "application/xml" },
      signal: AbortSignal.timeout(5000),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const xml = await resp.text();
    const entries = [...xml.matchAll(/<entry>[\s\S]*?<\/entry>/g)];
    if (entries.length === 0) throw new Error("No entries");
    const data = entries.slice(0, 10).map((match, i) => {
      const e = match[0];
      const title = (e.match(/<title[^>]*>([^<]*)<\/title>/) || [])[1]?.trim() || "Sin título";
      const author = (e.match(/<name[^>]*>([^<]*)<\/name>/) || [])[1]?.trim() || "YouTube";
      const videoId = (e.match(/<yt:videoId[^>]*>([^<]*)<\/yt:videoId>/) || [])[1]?.trim() || "";
      return {
        position: i + 1,
        title: title.slice(0, 80),
        meta: `📺 ${author} · YouTube Trending`,
        trend: "▶️",
        url: videoId ? `https://youtube.com/watch?v=${videoId}` : `https://youtube.com/results?search_query=${encodeURIComponent(title)}`,
      };
    });
    res.json({ source: "youtube", fallback: false, data, generated: new Date().toISOString() });
  } catch (e) {
    console.error("YouTube error:", e.message);
    res.json({ source: "youtube", fallback: true, data: fallback, error: e.message, generated: new Date().toISOString() });
  }
};
