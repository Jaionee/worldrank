// ===== WORLDRANK — app.js =====
// Datos vía Vercel Serverless Functions (mismo dominio, sin CORS)

// ── Actualizar timestamp ──
function updateTimestamp() {
  const now = new Date();
  const formatted = now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  document.getElementById("last-updated").textContent = `Actualizado: ${formatted}`;
}

// ── Crear card de ranking ──
function createRankCard(position, title, meta, trend = "📈") {
  const isTop3 = position <= 3;
  const medals = ["🥇", "🥈", "🥉"];
  const displayNum = isTop3 ? medals[position - 1] : `#${position}`;

  return `
    <div class="rank-card" style="animation-delay:${position * 0.05}s">
      <div class="rank-number ${isTop3 ? "top3" : ""}">${displayNum}</div>
      <div class="rank-info">
        <div class="rank-title" title="${title.replace(/"/g, "&quot;")}">${title}</div>
        <div class="rank-meta">${meta}</div>
      </div>
      <div class="rank-trend">${trend}</div>
    </div>`;
}

// ── Skeleton loaders ──
function showSkeletons(gridId, count = 8) {
  const grid = document.getElementById(gridId);
  grid.innerHTML = Array(count).fill('<div class="skeleton"></div>').join("");
}

// ── Renderizar datos en un grid ──
function renderGrid(gridId, items) {
  if (!items || items.length === 0) {
    document.getElementById(gridId).innerHTML =
      `<div class="rank-card" style="grid-column:1/-1">
        <div class="rank-info">
          <div class="rank-title">📡 Sin datos disponibles</div>
          <div class="rank-meta">Reintentando en la próxima actualización</div>
        </div>
      </div>`;
    return;
  }
  const html = items.map(item =>
    createRankCard(item.position, item.title, item.meta, item.trend || "📈")
  ).join("");
  document.getElementById(gridId).innerHTML = html;
}

// ── Cargar todas las fuentes desde /api/all ──
async function loadAllSources() {
  // Mostrar skeletons en todos los grids
  ["trends-grid", "youtube-grid", "reddit-grid", "twitter-grid"].forEach(id => showSkeletons(id, 8));

  try {
    const res = await fetch("/api/all");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Renderizar cada fuente
    renderGrid("trends-grid", data.trends);
    renderGrid("youtube-grid", data.youtube);
    renderGrid("reddit-grid", data.reddit);
    renderGrid("twitter-grid", data.twitter);

    // Total de temas (suma de todos los items)
    const total =
      (data.trends?.length || 0) +
      (data.youtube?.length || 0) +
      (data.reddit?.length || 0) +
      (data.twitter?.length || 0);
    document.getElementById("total-topics").textContent = `${total}+`;

  } catch (e) {
    console.error("Error loading sources:", e);
    // Fallback: datos locales si la API no responde
    loadFallback();
  }

  updateTimestamp();
}

// ── Fallback local si el servidor no responde ──
function loadFallback() {
  const trends = [
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
  const youtube = [
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
  const reddit = [
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
  const twitter = [
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

  renderGrid("trends-grid", trends);
  renderGrid("youtube-grid", youtube);
  renderGrid("reddit-grid", reddit);
  renderGrid("twitter-grid", twitter);
  document.getElementById("total-topics").textContent = "40+";
}

// ── Inicializar todo ──
async function init() {
  document.getElementById("total-topics").textContent = "40+";
  updateTimestamp();
  await loadAllSources();
}

// ── Auto-refresh cada 10 minutos ──
init();
setInterval(init, 10 * 60 * 1000);
