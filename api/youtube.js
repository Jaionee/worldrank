// WorldRank API — YouTube Trending Proxy
// Vercel Serverless Function (Node.js)

const YT_RSS = "https://www.youtube.com/feeds/videos.xml?chart=most_popular&hl=es&gl=ES";

const fallback = [
  { position: 1, title: "World Cup 2026 Highlights", meta: "📺 ESPN · YouTube Trending", trend: "▶️", url: "https://youtube.com/watch?v=w0AOGeqOnFY" },
  { position: 2, title: "MrBeast - $1 vs $1,000,000,000", meta: "📺 MrBeast · YouTube Trending", trend: "▶️", url: "https://youtube.com/watch?v=lh5tNKa3GbA" },
  { position: 3, title: "New iPhone 18 Pro Review", meta: "📺 MKBHD · YouTube Trending", trend: "▶️", url: "https://youtube.com/watch?v=H_zU0VMTyC0" },
  { position: 4, title: "AI Creates Realistic Human", meta: "📺 TechWorld · YouTube Trending", trend: "▶️", url: "https://youtube.com/watch?v=J6r1U5UQaH8" },
  { position: 5, title: "Incredible Football Goals 2026", meta: "📺 SportsCenter · YouTube Trending", trend: "▶️", url: "https://youtube.com/watch?v=9bZkp7q19f0" },
  { position: 6, title: "How Quantum Computers Work", meta: "📺 Veritasium · YouTube Trending", trend: "▶️", url: "https://youtube.com/watch?v=OWJCfOvochA" },
  { position: 7, title: "Top 10 Movies This Month", meta: "📺 IMDb · YouTube Trending", trend: "▶️", url: "https://youtube.com/watch?v=qsPgsfnsCqg" },
  { position: 8, title: "Extreme Weather Compilation", meta: "📺 BBC News · YouTube Trending", trend: "▶️", url: "https://youtube.com/watch?v=8PvR1BwBBb8" },
  { position: 9, title: "New Song - Global Hit", meta: "📺 Vevo · YouTube Trending", trend: "▶️", url: "https://youtube.com/watch?v=kXYiU_JCYtU" },
  { position: 10, title: "Prison Break Season 6 Trailer", meta: "📺 Netflix · YouTube Trending", trend: "▶️", url: "https://youtube.com/watch?v=AL8i7S2bCgQ" },
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
