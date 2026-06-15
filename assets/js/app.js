// ===== WORLDRANK — app.js =====
// Datos vía Vercel Serverless Functions (mismo dominio, sin CORS) + Mock Data local

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

// ── Crear card de producto/herramienta (comercial) ──
function createItemCard(item) {
  const card = document.createElement("div");
  card.className = "item-card";

  const scoreWidth = item.trendScore || 0;

  card.innerHTML = `
    <div class="item-card-header">
      <div class="item-emoji">${item.image || '📦'}</div>
      <div class="item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-category">${item.category || ''}</div>
      </div>
    </div>
    <div class="item-body">${item.description || ''}</div>
    <div class="item-meta">
      <span class="price-tag">💰 ${item.price || '—'}</span>
      <span class="trend-meter">
        <span class="score-bar"><span class="score-fill" style="width:${scoreWidth}%"></span></span>
        ${scoreWidth}/100
      </span>
    </div>
    ${item.growthSignals ? `<div class="growth-signal">📈 ${item.growthSignals}</div>` : ''}
    ${item.reason ? `<div style="font-size:.75rem;color:var(--text-secondary);margin-top:.3rem">💡 ${item.reason}</div>` : ''}
    <div class="item-actions">
      ${(item.affiliateLinks || []).map(link => `
        <a href="${link.url || '#'}" class="affiliate-btn primary" target="_blank" rel="noopener">
          ${link.type === 'comprar' ? '🛒' : link.type === 'probar gratis' ? '🎯' : '🔗'} ${link.platform}
        </a>
      `).join('')}
    </div>
  `;

  return card;
}

// ── Renderizar grid comercial desde datos mock ──
function renderCommercialGrid(gridId, items) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = "";
  if (!items || items.length === 0) {
    grid.innerHTML = '<div class="empty-state">No hay datos disponibles</div>';
    return;
  }
  items.forEach((item) => {
    grid.appendChild(createItemCard(item));
  });
}

// ── Renderizar grid de ranking ──
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

// ── Cargar datos comerciales desde mock data local ──
function loadMockData() {
  if (typeof WORLDRANK_DATA === 'undefined') {
    console.warn("mock-data.js no cargado");
    return;
  }
  const D = WORLDRANK_DATA;

  // Productos virales preview (top 4)
  renderCommercialGrid("productos-grid", (D.productosVirales || []).slice(0, 4));

  // Herramientas IA preview (top 4)
  renderCommercialGrid("ia-grid", (D.herramientasIA || []).slice(0, 4));

  // Ideas de negocio (todas o top 2)
  renderCommercialGrid("negocio-grid", (D.ideasNegocio || []).slice(0, 2));
}

// ── Cargar datos desde /api/all ──
async function loadData() {
  const colors = {
    trends: "linear-gradient(135deg, #f093fb, #f5576c)",
    youtube: "linear-gradient(135deg, #4facfe, #00f2fe)",
    reddit: "linear-gradient(135deg, #fa709a, #fee140)",
    twitter: "linear-gradient(135deg, #a18cd1, #fbc2eb)",
    tiktok: "linear-gradient(135deg, #fe2c55, #25f4ee)",
  };

  try {
    const resp = await fetch("/api/all", { signal: AbortSignal.timeout(8000) });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();

    const topicsEl = document.getElementById("total-topics");
    if (topicsEl && data.stats) {
      topicsEl.textContent = data.stats.total_topics || "40+";
    }

    renderGrid("trends-grid", data.trends, colors.trends);
    renderGrid("youtube-grid", data.youtube, colors.youtube);
    renderGrid("reddit-grid", data.reddit, colors.reddit);
    renderGrid("twitter-grid", data.twitter, colors.twitter);
    renderGrid("tiktok-grid", data.tiktok, colors.tiktok);

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

// ── Mobile nav toggle ──
function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
    });
  }
}

// ── Newsletter form ──
function initNewsletter() {
  const form = document.getElementById("newsletterForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletterEmail")?.value;
    if (!email) return;

    // Collect interests
    const interests = Array.from(
      document.querySelectorAll(".interest-tag input:checked")
    ).map(cb => cb.value);

    console.log("📬 Newsletter signup:", { email, interests });

    // Show success (would POST to API in production)
    const content = form.parentElement;
    const success = document.createElement("div");
    success.className = "newsletter-success show";
    success.innerHTML = `
      <div class="success-icon">🎉</div>
      <h3>¡Te has suscrito!</h3>
      <p>Pronto recibirás las mejores tendencias en <strong>${email}</strong></p>
    `;
    form.style.display = "none";
    content.appendChild(success);

    // In production, POST to an API endpoint
    // fetch("/api/newsletter", { method: "POST", body: JSON.stringify({ email, interests }) });
  });
}

// ── SPA Router para categorías y páginas especiales ──
function getRoute() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  return path;
}

const CATEGORY_MAP = {
  'productos-virales': {
    title: 'Productos Virales',
    icon: '🔥',
    key: 'productosVirales',
    desc: 'Los productos que más se están comprando y recomendando ahora mismo.',
    color: '#ef4444'
  },
  'herramientas-ia': {
    title: 'Herramientas IA',
    icon: '🤖',
    key: 'herramientasIA',
    desc: 'Inteligencia artificial que está revolucionando industrias enteras.',
    color: '#8b5cf6'
  },
  'apps': {
    title: 'Apps Populares',
    icon: '📱',
    key: 'appsPopulares',
    desc: 'Las aplicaciones que todo el mundo está usando.',
    color: '#06b6d4'
  },
  'tecnologia': {
    title: 'Tecnología',
    icon: '💻',
    key: 'tecnologia',
    desc: 'Gadgets y tecnología en tendencia.',
    color: '#10b981'
  },
  'videojuegos': {
    title: 'Videojuegos',
    icon: '🎮',
    key: 'videojuegos',
    desc: 'Los juegos que están arrasando.',
    color: '#f59e0b'
  },
  'libros': {
    title: 'Libros',
    icon: '📚',
    key: 'libros',
    desc: 'Los libros más vendidos y recomendados.',
    color: '#ec4899'
  },
  'belleza': {
    title: 'Belleza',
    icon: '💄',
    key: 'belleza',
    desc: 'Productos de belleza y cuidado personal en tendencia.',
    color: '#f472b6'
  },
  'ideas-de-negocio': {
    title: 'Ideas de Negocio',
    icon: '💡',
    key: 'ideasNegocio',
    desc: 'Oportunidades de negocio basadas en tendencias reales.',
    color: '#14b8a6'
  }
};

function showSection(id) {
  document.querySelectorAll('#oportunidades, #productos-virales-preview, #ia-preview, #negocio-preview, #trending, #youtube, #reddit, #twitter, #tiktok, #category-page, #page-anunciate, #page-worldrank-pro')
    .forEach(el => el.style.display = 'none');
  const target = document.getElementById(id);
  if (target) target.style.display = '';
}

function renderCategoryPage(slug) {
  const cat = CATEGORY_MAP[slug];
  if (!cat || typeof WORLDRANK_DATA === 'undefined') {
    window.location.href = '/';
    return;
  }

  showSection('category-page');

  document.getElementById('category-icon').textContent = cat.icon;
  document.getElementById('category-title').textContent = cat.title;
  document.getElementById('category-breadcrumb').textContent = cat.title;
  document.getElementById('category-breadcrumb').href = `/world-ranking/${slug}`;

  const items = WORLDRANK_DATA[cat.key] || [];
  document.getElementById('category-count').textContent = `${items.length} items`;
  document.title = `${cat.title} — WorldRank`;

  // Filters bar
  const filters = document.getElementById('category-filters');
  filters.innerHTML = `
    <div class="filter-info">${cat.desc}</div>
    <div class="filter-sort">
      <label>Ordenar:</label>
      <select onchange="sortCategoryGrid('${slug}', this.value)">
        <option value="trend">Tendencia</option>
        <option value="price-asc">Precio: menor a mayor</option>
        <option value="price-desc">Precio: mayor a menor</option>
        <option value="name">Nombre (A-Z)</option>
      </select>
    </div>
  `;

  // Render all items
  sortAndRenderCategory(items, 'trend');
}

window.sortCategoryGrid = function(slug, sortBy) {
  const cat = CATEGORY_MAP[slug];
  if (!cat || typeof WORLDRANK_DATA === 'undefined') return;
  const items = [...(WORLDRANK_DATA[cat.key] || [])];
  sortAndRenderCategory(items, sortBy);
};

function sortAndRenderCategory(items, sortBy) {
  let sorted = [...items];
  switch (sortBy) {
    case 'price-asc': sorted.sort((a, b) => parseFloat(a.price?.replace(/[^0-9.]/g, '') || 0) - parseFloat(b.price?.replace(/[^0-9.]/g, '') || 0)); break;
    case 'price-desc': sorted.sort((a, b) => parseFloat(b.price?.replace(/[^0-9.]/g, '') || 0) - parseFloat(a.price?.replace(/[^0-9.]/g, '') || 0)); break;
    case 'name': sorted.sort((a, b) => a.name?.localeCompare(b.name)); break;
    default: sorted.sort((a, b) => (b.trendScore || 0) - (a.trendScore || 0)); break;
  }
  renderCommercialGrid('category-grid', sorted);

  // Update URL without reload
  const activeSlug = Object.keys(CATEGORY_MAP).find(k => CATEGORY_MAP[k].key === items.key) || Object.keys(CATEGORY_MAP)[0];
  // simpler: find from current pathname
  const pathParts = window.location.pathname.split('/');
  const currentSlug = pathParts[pathParts.length - 1];
  history.replaceState(null, '', `/world-ranking/${currentSlug}?sort=${sortBy}`);
}

function initRouter() {
  const path = getRoute();

  // Category routes
  const match = path.match(/^\/world-ranking\/([\w-]+)$/);
  if (match && CATEGORY_MAP[match[1]]) {
    renderCategoryPage(match[1]);
    return;
  }

  // Special pages
  if (path === '/anunciate') {
    showSection('page-anunciate');
    document.title = 'Anúnciate — WorldRank';
    return;
  }

  if (path === '/worldrank-pro' || path === '/pro') {
    showSection('page-worldrank-pro');
    document.title = 'WorldRank Pro — WorldRank';
    return;
  }

  // Home page (default)
  document.title = 'WorldRank — Tendencias y Oportunidades de Negocio en Tiempo Real';
  // All sections visible by default via CSS
  document.querySelectorAll('#oportunidades, #productos-virales-preview, #ia-preview, #negocio-preview, #trending, #youtube, #reddit, #twitter, #tiktok')
    .forEach(el => el.style.display = '');
}

// ── Inicializar ──
document.addEventListener("DOMContentLoaded", () => {
  // SPA router first
  initRouter();

  updateTimestamp();
  initNavToggle();
  initNewsletter();

  // Cargar datos comerciales desde mock data (instantáneo)
  loadMockData();

  // Cargar datos de tendencias desde API
  loadData();

  // Handle browser back/forward
  window.addEventListener('popstate', initRouter);

  // Auto-refresh cada 10 minutos
  setInterval(loadData, 600000);
});
