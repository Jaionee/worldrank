// WorldRank API — Google Trends Proxy
// Vercel Serverless Function (Node.js)

const TRENDS_RSS = "https://trends.google.com/trends/trendingsearches/daily/rss?geo=US";

async function fetchRss(url) {
  const resp = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; WorldRank/1.0; +https://worldrank.vercel.app)",
      Accept: "application/xml, text/xml",
    },
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.text();
}

function parseTrendsXml(xml) {
  const results = [];
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  for (let i = 0; i < items.length && i < 10; i++) {
    const item = items[i];
    const title = (item.match(/<title[^>]*>([^<]*)<\/title>/) || [])[1]?.trim() || "Tendencia";
    const traffic = (item.match(/<ht:approx_traffic[^>]*>([^<]*)<\/ht:approx_traffic>/) || [])[1];
    let meta;
    if (traffic) {
      const num = parseInt(traffic.replace(/[^\d]/g, ""));
      if (num >= 1000000) meta = `🔍 ${Math.floor(num / 1000000)}M+ búsquedas`;
      else if (num >= 1000) meta = `🔍 ${Math.floor(num / 1000)}K+ búsquedas`;
      else meta = `🔍 ${num} búsquedas`;
    } else {
      meta = "🔍 Google Trends Global";
    }
    results.push({ position: i + 1, title: title.slice(0, 80), meta, trend: "🔥" });
  }
  return results;
}

function getFallback() {
  return [
    { position: 1, title: "US Open 2026", meta: "🔍 2M+ búsquedas", trend: "🔥" },
    { position: 2, title: "World Cup Qualifiers", meta: "🔍 1.5M+ búsquedas", trend: "🔥" },
    { position: 3, title: "iPhone 18 Pro", meta: "🔍 1.2M+ búsquedas", trend: "🔥" },
    { position: 4, title: "Hurricane Season", meta: "🔍 980K+ búsquedas", trend: "📈" },
    { position: 5, title: "Bitcoin Price Today", meta: "🔍 850K+ búsquedas", trend: "📈" },
    { position: 6, title: "AI News", meta: "🔍 720K+ búsquedas", trend: "📈" },
    { position: 7, title: "Tesla Robotaxi", meta: "🔍 680K+ búsquedas", trend: "📈" },
    { position: 8, title: "Summer Olympics 2028", meta: "🔍 610K+ búsquedas", trend: "📈" },
    { position: 9, title: "NVIDIA Stock", meta: "🔍 590K+ búsquedas", trend: "📈" },
    { position: 10, title: "SpaceX Mars Mission", meta: "🔍 520K+ búsquedas", trend: "📈" },
  ];
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");

  try {
    const xml = await fetchRss(TRENDS_RSS);
    const data = parseTrendsXml(xml);
    res.json({ source: "google-trends", data });
  } catch (e) {
    console.error("Trends API error:", e.message);
    res.json({ source: "google-trends", data: getFallback(), fallback: true });
  }
};
