// WorldRank API — Google Trends Proxy
// Vercel Serverless Function (Node.js)

const TRENDS_RSS = "https://trends.google.com/trends/trendingsearches/daily/rss?geo=US";

const fallback = [
  { position: 1, title: "US Open 2026", meta: "🔍 2M+ búsquedas", trend: "🔥", url: "https://www.google.com/search?q=US+Open+2026" },
  { position: 2, title: "World Cup Qualifiers", meta: "🔍 1.5M+ búsquedas", trend: "🔥", url: "https://www.google.com/search?q=World+Cup+Qualifiers+2026" },
  { position: 3, title: "iPhone 18 Pro", meta: "🔍 1.2M+ búsquedas", trend: "🔥", url: "https://www.google.com/search?q=iPhone+18+Pro" },
  { position: 4, title: "Hurricane Season", meta: "🔍 980K+ búsquedas", trend: "📈", url: "https://www.google.com/search?q=Hurricane+Season+2026" },
  { position: 5, title: "Bitcoin Price Today", meta: "🔍 850K+ búsquedas", trend: "📈", url: "https://www.google.com/search?q=Bitcoin+Price+Today" },
  { position: 6, title: "AI News", meta: "🔍 720K+ búsquedas", trend: "📈", url: "https://www.google.com/search?q=AI+News" },
  { position: 7, title: "Tesla Robotaxi", meta: "🔍 680K+ búsquedas", trend: "📈", url: "https://www.google.com/search?q=Tesla+Robotaxi" },
  { position: 8, title: "Summer Olympics 2028", meta: "🔍 610K+ búsquedas", trend: "📈", url: "https://www.google.com/search?q=Summer+Olympics+2028" },
  { position: 9, title: "NVIDIA Stock", meta: "🔍 590K+ búsquedas", trend: "📈", url: "https://www.google.com/search?q=NVIDIA+Stock" },
  { position: 10, title: "SpaceX Mars Mission", meta: "🔍 520K+ búsquedas", trend: "📈", url: "https://www.google.com/search?q=SpaceX+Mars+Mission" },
];

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");

  try {
    const resp = await fetch(TRENDS_RSS, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; WorldRank/1.0)", Accept: "application/rss+xml" },
      signal: AbortSignal.timeout(5000),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const xml = await resp.text();
    const items = [...xml.matchAll(/<item>[\s\S]*?<\/item>/g)];
    if (items.length === 0) throw new Error("No items");
    const data = items.slice(0, 10).map((match, i) => {
      const e = match[0];
      const title = (e.match(/<title[^>]*><!\[CDATA\[([^\]]*)\]\]><\/title>/) ||
                     e.match(/<title[^>]*>([^<]*)<\/title>/))?.[1]?.trim() || "Tendencia";
      const traffic = e.match(/<approx_traffic[^>]*>([^<]*)<\/approx_traffic>/)?.[1]?.trim() || "";
      return {
        position: i + 1,
        title: title.slice(0, 80),
        meta: traffic ? `🔍 ${traffic} búsquedas` : "🔍 Google Trends USA",
        trend: "🔥",
        url: `https://www.google.com/search?q=${encodeURIComponent(title)}`,
      };
    });
    res.json({ source: "google-trends", fallback: false, data, generated: new Date().toISOString() });
  } catch (e) {
    console.error("Trends error:", e.message);
    res.json({ source: "google-trends", fallback: true, data: fallback, error: e.message, generated: new Date().toISOString() });
  }
};
