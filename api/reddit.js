// WorldRank API — Reddit Hot Posts Proxy
// Vercel Serverless Function (Node.js)

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

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");

  try {
    const resp = await fetch(REDDIT_URL, {
      headers: { "User-Agent": "WorldRank/1.0 (by /u/jaionee)", Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const json = await resp.json();
    const children = json?.data?.children || [];
    if (children.length === 0) throw new Error("No posts");
    const data = children.slice(0, 10).map((child, i) => {
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
    res.json({ source: "reddit", fallback: false, data, generated: new Date().toISOString() });
  } catch (e) {
    console.error("Reddit error:", e.message);
    res.json({ source: "reddit", fallback: true, data: fallback, error: e.message, generated: new Date().toISOString() });
  }
};
