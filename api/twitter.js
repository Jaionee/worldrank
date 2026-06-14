// WorldRank API — X/Twitter Trends
// Vercel Serverless Function (Node.js)

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
  res.json({
    source: "twitter",
    fallback: true,
    data: [
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
    ],
    generated: new Date().toISOString(),
  });
};
