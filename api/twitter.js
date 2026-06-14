// WorldRank API — X/Twitter Trends
// Vercel Serverless Function (Node.js)
// Datos de muestra realistas (Twitter no tiene API gratuita)

function getTrends() {
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

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=600, s-maxage=600");
  res.json({ source: "twitter", data: getTrends() });
};
