// WorldRank API — YouTube Trending Proxy
// Vercel Serverless Function (Node.js)

// YouTube RSS for most popular videos in ES
const YT_RSS = "https://www.youtube.com/feeds/videos.xml?chart=most_popular&hl=es&gl=ES";

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

function parseYouTubeXml(xml) {
  const results = [];
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
  for (let i = 0; i < entries.length && i < 10; i++) {
    const entry = entries[i];
    const title = (entry.match(/<title[^>]*>([^<]*)<\/title>/) || [])[1]?.trim() || "Sin título";
    // Try various author patterns
    let author = (entry.match(/<name[^>]*>([^<]*)<\/name>/) || [])[1]?.trim() || "YouTube";
    results.push({
      position: i + 1,
      title: title.slice(0, 80),
      meta: `📺 ${author} · YouTube Trending`,
      trend: "▶️",
    });
  }
  return results;
}

function getFallback() {
  return [
    { position: 1, title: "World Cup 2026 Highlights", meta: "📺 ESPN · YouTube Trending", trend: "▶️" },
    { position: 2, title: "MrBeast — $1 vs $1,000,000,000", meta: "📺 MrBeast · YouTube Trending", trend: "▶️" },
    { position: 3, title: "New iPhone 18 Pro Review", meta: "📺 MKBHD · YouTube Trending", trend: "▶️" },
    { position: 4, title: "AI Creates Realistic Human", meta: "📺 TechWorld · YouTube Trending", trend: "▶️" },
    { position: 5, title: "Incredible Football Goals 2026", meta: "📺 SportsCenter · YouTube Trending", trend: "▶️" },
    { position: 6, title: "How Quantum Computers Work", meta: "📺 Veritasium · YouTube Trending", trend: "▶️" },
    { position: 7, title: "Top 10 Movies This Month", meta: "📺 IMDb · YouTube Trending", trend: "▶️" },
    { position: 8, title: "Extreme Weather Compilation", meta: "📺 BBC News · YouTube Trending", trend: "▶️" },
    { position: 9, title: "New Song — Global Hit", meta: "📺 Vevo · YouTube Trending", trend: "▶️" },
    { position: 10, title: "Prison Break Season 6 Trailer", meta: "📺 Netflix · YouTube Trending", trend: "▶️" },
  ];
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");

  try {
    const xml = await fetchRss(YT_RSS);
    const data = parseYouTubeXml(xml);
    if (data.length === 0) throw new Error("No entries found");
    res.json({ source: "youtube", data });
  } catch (e) {
    console.error("YouTube API error:", e.message);
    res.json({ source: "youtube", data: getFallback(), fallback: true });
  }
};
