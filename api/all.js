// WorldRank API — Endpoint combinado (carga todas las fuentes en paralelo)
// Vercel Serverless Function (Node.js)

const BASE = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://worldrank-eta.vercel.app";

const SOURCES = ["trends", "youtube", "reddit", "twitter"];

async function fetchSource(name) {
  try {
    const resp = await fetch(`${BASE}/api/${name}`, { timeout: 8000 });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return resp.json();
  } catch (e) {
    console.error(`Error fetching ${name}:`, e.message);
    return { source: name, data: [], error: e.message };
  }
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=120, s-maxage=120");

  try {
    const results = await Promise.all(SOURCES.map(fetchSource));

    const response = {
      timestamp: new Date().toISOString(),
      stats: {
        total_topics: "40+",
        sources: 4,
        coverage: "🌐",
      },
    };

    for (const r of results) {
      response[r.source] = r.data || [];
    }

    res.json(response);
  } catch (e) {
    console.error("All endpoint error:", e.message);
    res.status(500).json({ error: "Failed to fetch sources" });
  }
};
