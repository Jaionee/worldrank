// WorldRank API — Reddit Hot Posts Proxy
// Vercel Serverless Function (Node.js)

const REDDIT_URL = "https://www.reddit.com/r/all/hot.json?limit=10";

async function fetchJson(url) {
  const resp = await fetch(url, {
    headers: {
      "User-Agent": "WorldRank/1.0 (by /u/jaionee) - ranking dashboard",
      Accept: "application/json",
    },
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}

function parseReddit(json) {
  const children = json?.data?.children || [];
  return children.map((child, i) => {
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
}

function getFallback() {
  return [
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
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=120, s-maxage=120");

  try {
    const json = await fetchJson(REDDIT_URL);
    const data = parseReddit(json);
    if (data.length === 0) throw new Error("No posts found");
    res.json({ source: "reddit", data });
  } catch (e) {
    console.error("Reddit API error:", e.message);
    res.json({ source: "reddit", data: getFallback(), fallback: true });
  }
};
