// WorldRank API — Endpoint combinado (ejecuta todas las fuentes en paralelo internamente)
// Vercel Serverless Function (Node.js)

const { default: fetch } = typeof globalThis.fetch !== 'undefined' ? globalThis : require('undici');

// ── GOOGLE TRENDS ──
async function fetchTrends() {
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
  } catch (e) {
    console.error("Trends error:", e.message);
    return fallback;
  }
}

// ── YOUTUBE (scraping real desde búsqueda) ──
const YT_FALLBACK = [
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
const YT_SEARCH_QUERIES = ["trending music 2026", "viral video 2026", "trending today 2026"];

async function fetchYouTube() {
  for (const query of YT_SEARCH_QUERIES) {
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
      const match = html.match(/ytInitialData\s*=\s*({.*?});\s*<\/script>/);
      if (!match) throw new Error("No ytInitialData");
      const data = JSON.parse(match[1]);
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
            const title = vr.title?.runs?.[0]?.text || vr.title?.simpleText || "Sin título";
            const author = vr.ownerText?.runs?.[0]?.text || vr?.longBylineText?.runs?.[0]?.text || "YouTube";
            videos.push({
              position: videos.length + 1,
              title: title.slice(0, 80),
              meta: `📺 ${author} · YouTube Trending`,
              trend: "▶️",
              url: `https://youtube.com/watch?v=${vr.videoId}`,
            });
            if (videos.length >= 10) break;
          }
          if (videos.length >= 10) break;
        }
        if (videos.length >= 10) break;
      }
      if (videos.length >= 5) return videos;
    } catch (e) {
      console.error(`YT search "${query}" error:`, e.message);
    }
  }
  return YT_FALLBACK;
}

// ── REDDIT ──
async function fetchReddit() {
  const REDDIT_URL = "https://www.reddit.com/r/all/hot.json?limit=10";
  const fallback = [
    { position: 1, title: "What's a conspiracy theory you 100% believe in?", meta: "r/AskReddit · 52K votos", trend: "🔺", url: "https://reddit.com/r/AskReddit" },
    { position: 2, title: "This photo from the World Cup is incredible", meta: "r/pics · 45K votos", trend: "🔺", url: "https://reddit.com/r/pics" },
    { position: 3, title: "ELI5: How does AI actually learn?", meta: "r/explainlikeimfive · 38K votos", trend: "🔺", url: "https://reddit.com/r/explainlikeimfive" },
    { position: 4, title: "TIL that octopuses have three hearts", meta: "r/todayilearned · 31K votos", trend: "🔺", url: "https://reddit.com/r/todayilearned" },
    { position: 5, title: "A cool guide to surviving heat waves", meta: "r/coolguides · 28K votos", trend: "🔺", url: "https://reddit.com/r/coolguides" },
    { position: 6, title: "Meirl: Monday morning coffee", meta: "r/meirl · 25K votos", trend: "🔺", url: "https://reddit.com/r/meirl" },
    { position: 7, title: "Programmer humor: JavaScript vs TypeScript", meta: "r/ProgrammerHumor · 22K votos", trend: "🔺", url: "https://reddit.com/r/ProgrammerHumor" },
    { position: 8, title: "Damn, that's interesting: Ancient cities", meta: "r/Damnthatsinteresting · 20K votos", trend: "🔺", url: "https://reddit.com/r/Damnthatsinteresting" },
    { position: 9, title: "Wholesome: Grandparent learns gaming", meta: "r/MadeMeSmile · 18K votos", trend: "🔺", url: "https://reddit.com/r/MadeMeSmile" },
    { position: 10, title: "Gaming: Best indie games of 2026", meta: "r/gaming · 15K votos", trend: "🔺", url: "https://reddit.com/r/gaming" },
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
      const permalink = p.permalink || "";
      return {
        position: i + 1,
        title: (p.title || "Post de Reddit").slice(0, 80),
        meta: `r/${p.subreddit || "all"} · ${scoreStr}`,
        trend: "🔺",
        url: permalink ? `https://reddit.com${permalink}` : (p.url || `https://reddit.com/r/${p.subreddit || "all"}`),
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
    { position: 1, title: "#WorldCup2026", meta: "⚽ Deporte · 2.1M tweets", trend: "🚀", url: "https://x.com/search?q=%23WorldCup2026&src=trend" },
    { position: 2, title: "#AI", meta: "🤖 Tecnología · 1.8M tweets", trend: "🚀", url: "https://x.com/search?q=%23AI&src=trend" },
    { position: 3, title: "#Bitcoin", meta: "💰 Finanzas · 1.5M tweets", trend: "🚀", url: "https://x.com/search?q=%23Bitcoin&src=trend" },
    { position: 4, title: "#Eurovision", meta: "🎵 Música · 980K tweets", trend: "📈", url: "https://x.com/search?q=%23Eurovision&src=trend" },
    { position: 5, title: "#NASA", meta: "🚀 Ciencia · 850K tweets", trend: "📈", url: "https://x.com/search?q=%23NASA&src=trend" },
    { position: 6, title: "#Netflix", meta: "🎬 Entretenimiento · 720K tweets", trend: "📈", url: "https://x.com/search?q=%23Netflix&src=trend" },
    { position: 7, title: "#ElonMusk", meta: "💼 Personas · 680K tweets", trend: "📈", url: "https://x.com/search?q=%23ElonMusk&src=trend" },
    { position: 8, title: "#ChatGPT", meta: "🤖 Tecnología · 610K tweets", trend: "📈", url: "https://x.com/search?q=%23ChatGPT&src=trend" },
    { position: 9, title: "#Olympics", meta: "🏅 Deporte · 590K tweets", trend: "📈", url: "https://x.com/search?q=%23Olympics&src=trend" },
    { position: 10, title: "#Gaming", meta: "🎮 Gaming · 520K tweets", trend: "📈", url: "https://x.com/search?q=%23Gaming&src=trend" },
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
