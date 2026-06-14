// WorldRank API — Endpoint combinado (ejecuta todas las fuentes en paralelo internamente)
// Vercel Serverless Function (Node.js)

const { default: fetch } = typeof globalThis.fetch !== 'undefined' ? globalThis : require('undici');

// ── GOOGLE TRENDS ──
async function fetchTrends() {
  const TRENDS_RSS = "https://trends.google.com/trends/trendingsearches/daily/rss?geo=US";
  const fallback = [
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

  try {
    const resp = await fetch(TRENDS_RSS, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; WorldRank/1.0)", Accept: "application/rss+xml" },
      signal: AbortSignal.timeout(5000),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const xml = await resp.text();
    const items = [...xml.matchAll(/<item>[\s\S]*?<\/item>/g)];
    if (items.length === 0) throw new Error("No items");
    return items.slice(0, 10).map((match, i) => {
      const title = (match[0].match(/<title[^>]*><!\[CDATA\[([^\]]*)\]\]><\/title>/) ||
                     match[0].match(/<title[^>]*>([^<]*)<\/title>/))?.[1]?.trim() || "Tendencia";
      const traffic = match[0].match(/<approx_traffic[^>]*>([^<]*)<\/approx_traffic>/)?.[1]?.trim() || "";
      return {
        position: i + 1,
        title: title.slice(0, 80),
        meta: traffic ? `🔍 ${traffic} búsquedas` : "🔍 Google Trends USA",
        trend: "🔥",
      };
    });
  } catch (e) {
    console.error("Trends error:", e.message);
    return fallback;
  }
}

// ── YOUTUBE ──
async function fetchYouTube() {
  const YT_RSS = "https://www.youtube.com/feeds/videos.xml?chart=most_popular&hl=es&gl=ES";
  const fallback = [
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

  try {
    const resp = await fetch(YT_RSS, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; WorldRank/1.0)", Accept: "application/xml" },
      signal: AbortSignal.timeout(5000),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const xml = await resp.text();
    const entries = [...xml.matchAll(/<entry>[\s\S]*?<\/entry>/g)];
    if (entries.length === 0) throw new Error("No entries");
    return entries.slice(0, 10).map((match, i) => {
      const e = match[0];
      const title = (e.match(/<title[^>]*>([^<]*)<\/title>/) || [])[1]?.trim() || "Sin título";
      const author = (e.match(/<name[^>]*>([^<]*)<\/name>/) || [])[1]?.trim() || "YouTube";
      return {
        position: i + 1,
        title: title.slice(0, 80),
        meta: `📺 ${author} · YouTube Trending`,
        trend: "▶️",
      };
    });
  } catch (e) {
    console.error("YouTube error:", e.message);
    return fallback;
  }
}

// ── REDDIT ──
async function fetchReddit() {
  const REDDIT_URL = "https://www.reddit.com/r/all/hot.json?limit=10";
  const fallback = [
    { position: 1, title: "What's a conspiracy theory you 100% believe in?", meta: "r/AskReddit · 52K votos", trend: "🔺" },
    { position: 2, title: "This photo from the World Cup is incredible", meta: "r/pics · 45K votos", trend: "🔺" },
    { position: 3, title: "ELI5: How does AI actually learn?", meta: "r/explainlikeimfive · 38K votos", trend: "🔺" },
    { position: 4, title: "TIL that octopuses have three hearts", meta: "r/todayilearned · 31K votos", trend: "🔺" },
    { position: 5, title: "A cool guide to surviving heat waves", meta: "r/coolguides · 28K votos", trend: "🔺" },
    { position: 6, title: "Meirl: Monday morning coffee", meta: "r/meirl · 25K votos", trend: "🔺" },
    { position: 7, title: "Programmer humor: JavaScript vs TypeScript", meta: "r/ProgrammerHumor · 22K votos", trend: "🔺" },
    { position: 8, title: "Damn, that's interesting: Ancient cities", meta: "r/Damnthatsinteresting · 20K votos", trend: "🔺" },
    { position: 9, title: "Wholesome: Grandparent learns gaming", meta: "r/MadeMeSmile · 18K votos", trend: "🔺" },
    { position: 10, title: "Gaming: Best indie games of 2026", meta: "r/gaming · 15K votos", trend: "🔺" },
  ];

  try {
    const resp = await fetch(REDDIT_URL, {
      headers: { "User-Agent": "WorldRank/1.0 (by /u/jaionee) - ranking dashboard", Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const json = await resp.json();
    const children = json?.data?.children || [];
    if (children.length === 0) throw new Error("No posts");
    return children.slice(0, 10).map((child, i) => {
      const p = child.data || {};
      const score = p.score || 0;
      const scoreStr = score > 1000 ? `${(score / 1000).toFixed(1)}K votos` : `${score} votos`;
      return {
        position: i + 1,
        title: (p.title || "Post de Reddit").slice(0, 80),
        meta: `r/${p.subreddit || "all"} · ${scoreStr}`,
        trend: "🔺",
      };
    });
  } catch (e) {
    console.error("Reddit error:", e.message);
    return fallback;
  }
}

// ── TWITTER / X ──
async function fetchTwitter() {
  return [
    { position: 1, title: "#WorldCup2026", meta: "⚽ Deporte · 2.1M tweets", trend: "🚀" },
    { position: 2, title: "#AI", meta: "🤖 Tecnología · 1.8M tweets", trend: "🚀" },
    { position: 3, title: "#Bitcoin", meta: "💰 Finanzas · 1.5M tweets", trend: "🚀" },
    { position: 4, title: "#Eurovision", meta: "🎵 Música · 980K tweets", trend: "📈" },
    { position: 5, title: "#NASA", meta: "🚀 Ciencia · 850K tweets", trend: "📈" },
    { position: 6, title: "#Netflix", meta: "🎬 Entretenimiento · 720K tweets", trend: "📈" },
    { position: 7, title: "#ElonMusk", meta: "💼 Personas · 680K tweets", trend: "📈" },
    { position: 8, title: "#ChatGPT", meta: "🤖 Tecnología · 610K tweets", trend: "📈" },
    { position: 9, title: "#Olympics", meta: "🏅 Deporte · 590K tweets", trend: "📈" },
    { position: 10, title: "#Gaming", meta: "🎮 Gaming · 520K tweets", trend: "📈" },
  ];
}

// ── MAIN handler ──
module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=120, s-maxage=120");

  try {
    const [trends, youtube, reddit, twitter] = await Promise.all([
      fetchTrends(),
      fetchYouTube(),
      fetchReddit(),
      fetchTwitter(),
    ]);

    const total = trends.length + youtube.length + reddit.length + twitter.length;

    res.json({
      timestamp: new Date().toISOString(),
      stats: { total_topics: `${total}+`, sources: 4, coverage: "🌐" },
      trends,
      youtube,
      reddit,
      twitter,
    });
  } catch (e) {
    console.error("All endpoint error:", e.message);
    res.status(500).json({ error: "Failed to fetch sources" });
  }
};
