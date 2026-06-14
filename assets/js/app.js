// ===== WORLDRANK — app.js =====
// Datos vía Vercel Serverless Functions (mismo dominio, sin CORS)

// ── Actualizar timestamp ──
function updateTimestamp() {
  const now = new Date();
  const formato = now.toLocaleString("es-ES", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    timeZoneName: "short",
  });
  const el = document.getElementById("last-updated");
  if (el) el.textContent = `Actualizado ${formato}`;
}

// ── Crear card de ranking (cliqueable) ──
function createRankCard(item, color) {
  const pos = item.position || 0;
  const title = item.title || "—";
  const meta = item.meta || "";
  const trend = item.trend || "";
  const url = item.url || "";

  const card = document.createElement("div");
  card.className = "rank-card";

  card.innerHTML = `
    <div class="rank-number" style="background: ${color || "#333"}">${pos}</div>
    <div class="rank-info">
      <div class="rank-title">${title}</div>
      <div class="rank-meta">${meta}</div>
    </div>
    <div class="rank-trend">${trend}</div>
  `;

  // Si tiene URL, el card completo es cliqueable
  if (url) {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      window.open(url, "_blank", "noopener,noreferrer");
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        window.open(url, "_blank", "noopener,noreferrer");
      }
    });
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Abrir ${title}`);
  }

  return card;
}

// ── Renderizar grid ──
function renderGrid(gridId, items, color) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = "";
  if (!items || items.length === 0) {
    grid.innerHTML = '<div class="empty-state">No hay datos disponibles</div>';
    return;
  }
  items.forEach((item) => {
    grid.appendChild(createRankCard(item, color));
  });
}

// ── Cargar datos desde /api/all ──
async function loadData() {
  const colors = {
    trends: "linear-gradient(135deg, #f093fb, #f5576c)",
    youtube: "linear-gradient(135deg, #4facfe, #00f2fe)",
    reddit: "linear-gradient(135deg, #fa709a, #fee140)",
    twitter: "linear-gradient(135deg, #a18cd1, #fbc2eb)",
  };

  try {
    const resp = await fetch("/api/all", { signal: AbortSignal.timeout(8000) });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();

    // Actualizar stats
    const topicsEl = document.getElementById("total-topics");
    if (topicsEl && data.stats) {
      topicsEl.textContent = data.stats.total_topics || "40+";
    }

    // Renderizar cada grid
    renderGrid("trends-grid", data.trends, colors.trends);
    renderGrid("youtube-grid", data.youtube, colors.youtube);
    renderGrid("reddit-grid", data.reddit, colors.reddit);
    renderGrid("twitter-grid", data.twitter, colors.twitter);

    updateTimestamp();
  } catch (e) {
    console.error("Error cargando datos:", e.message);
    document.querySelectorAll(".ranking-grid").forEach((grid) => {
      if (grid.children.length === 0 || grid.children[0]?.classList.contains("skeleton")) {
        grid.innerHTML = `<div class="empty-state">⚠️ Error al cargar: ${e.message}</div>`;
      }
    });
  }
}

// ── Inicializar ──
document.addEventListener("DOMContentLoaded", () => {
  updateTimestamp();
  loadData();

  // Auto-refresh cada 10 minutos
  setInterval(loadData, 600000);
});
