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
    const resp = await fetch("data/data.json", { signal: AbortSignal.timeout(8000) });
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
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector("button[type='submit']");
    const email = document.getElementById("newsletterEmail")?.value;
    if (!email) return;

    const interests = Array.from(
      document.querySelectorAll(".interest-tag input:checked")
    ).map(cb => cb.value);

    // Disable button
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Enviando..."; }

    try {
      const supabase = window.supabaseClient || window.supabase.createClient(
        'https://eswmmdejyldalfupmxit.supabase.co',
        'sb_publishable_lKjBf1R3Mp61eTFVj6Z8Vw_SirlxcAa'
      );
      window.supabaseClient = supabase;

      const { data: existing, error: checkErr } = await supabase
        .from('newsletter')
        .select('id, active')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (existing) {
        if (existing.active) {
          // Already subscribed
          const content = form.parentElement;
          const success = document.createElement('div');
          success.className = 'newsletter-success show';
          success.innerHTML = `
            <div class="success-icon">✅</div>
            <h3>Ya estabas suscrito</h3>
            <p>El email <strong>${email}</strong> ya está en nuestra lista. ¡Gracias!</p>
          `;
          form.style.display = 'none';
          content.appendChild(success);
          return;
        }
        // Re-activate
        await supabase.from('newsletter').update({ active: true, interests }).eq('id', existing.id);
      } else {
        // New subscription
        const { error: insertErr } = await supabase.from('newsletter').insert({
          email: email.toLowerCase().trim(),
          interests,
          source: 'web',
        });
        if (insertErr) throw insertErr;
      }

      // Success
      const content = form.parentElement;
      const success = document.createElement('div');
      success.className = 'newsletter-success show';
      success.innerHTML = `
        <div class="success-icon">🎉</div>
        <h3>¡Te has suscrito!</h3>
        <p>Pronto recibirás las mejores tendencias en <strong>${email}</strong></p>
      `;
      form.style.display = 'none';
      content.appendChild(success);
    } catch (err) {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Suscribirse"; }
      console.error(err);
      alert("Error al suscribir. Inténtalo de nuevo.");
    }
  });
}

// ── SPA Router para categorías y páginas especiales ──
function getRoute() {
  let path = window.location.pathname.replace(/\/+$/, '') || '/';
  // Handle GitHub Pages subpath base
  var baseEl = document.querySelector('base');
  if (baseEl) {
    try {
      var basePath = new URL(baseEl.href, location.origin).pathname.replace(/\/$/, '');
      if (basePath && path.startsWith(basePath)) {
        path = path.slice(basePath.length) || '/';
      }
    } catch(e) {}
  }
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
  document.querySelectorAll('#oportunidades, #productos-virales-preview, #ia-preview, #negocio-preview, #trending, #youtube, #reddit, #twitter, #tiktok, #category-page, #page-anunciate, #page-worldrank-pro, #page-admin')
    .forEach(el => el.style.display = 'none');
  const target = document.getElementById(id);
  if (target) target.style.display = '';
}

function renderCategoryPage(slug) {
  const cat = CATEGORY_MAP[slug];
  if (!cat) {
    window.location.href = '/';
    return;
  }
  if (typeof WORLDRANK_DATA === 'undefined') {
    showSection('category-page');
    document.getElementById('category-icon').textContent = cat.icon;
    document.getElementById('category-title').textContent = cat.title;
    document.getElementById('category-breadcrumb').textContent = cat.title;
    document.getElementById('category-breadcrumb').href = `/world-ranking/${slug}`;
    document.getElementById('category-count').textContent = '... cargando';
    document.getElementById('category-grid').innerHTML = '<div class="empty-state">⏳ Cargando datos...</div>';
    document.title = `${cat.title} — WorldRank`;
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

  // Admin panel
  if (path === '/admin') {
    showSection('page-admin');
    document.title = 'Admin — WorldRank';
    setTimeout(initAdmin, 100);
    return;
  }

  // Home page (default)
  document.title = 'WorldRank — Tendencias y Oportunidades de Negocio en Tiempo Real';
  // All sections visible by default via CSS
  document.querySelectorAll('#oportunidades, #productos-virales-preview, #ia-preview, #negocio-preview, #trending, #youtube, #reddit, #twitter, #tiktok')
    .forEach(el => el.style.display = '');
}

// ── Advertise form ──
function initAdvertiseForm() {
  const form = document.getElementById("advertiseForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type='submit']");
    const data = {
      company_name: form.querySelector("input[name='company']")?.value?.trim() || "",
      website: form.querySelector("input[name='website']")?.value?.trim() || "",
      email: form.querySelector("input[name='email']")?.value?.trim() || "",
      phone: form.querySelector("input[name='phone']")?.value?.trim() || "",
      plan: form.querySelector("select[name='plan']")?.value || "starter",
      budget: form.querySelector("select[name='budget']")?.value || "",
      message: form.querySelector("textarea[name='message']")?.value?.trim() || "",
    };

    if (!data.company_name || !data.email) {
      alert("Nombre de empresa y email son obligatorios");
      return;
    }

    if (btn) { btn.disabled = true; btn.textContent = "Enviando..."; }

    try {
      const supabase = window.supabaseClient || window.supabase.createClient(
        'https://eswmmdejyldalfupmxit.supabase.co',
        'sb_publishable_lKjBf1R3Mp61eTFVj6Z8Vw_SirlxcAa'
      );
      window.supabaseClient = supabase;

      const { error: insertErr } = await supabase.from('advertisers').insert({
        company_name: data.company_name,
        email: data.email,
        website: data.website,
        phone: data.phone,
        plan: data.plan,
        budget: data.budget,
        message: data.message,
      });

      if (insertErr) throw insertErr;

      // Show success message
      const section = form.closest(".advertise-form-section") || form.parentElement;
      section.innerHTML = `
        <div class="newsletter-success show" style="text-align:center;padding:3rem">
          <div class="success-icon">🎉</div>
          <h3>¡Solicitud enviada!</h3>
          <p>Te contactaremos pronto con nuestras tarifas y opciones disponibles.</p>
        </div>
      `;
    } catch (err) {
      if (btn) { btn.disabled = false; btn.textContent = "Enviar solicitud"; }
      console.error(err);
      alert("Error al enviar. Inténtalo de nuevo.");
    }
  });
}

// ── Auth: Modal + Login + Register ──
function initAuthModal() {
  const modal = document.getElementById("authModal");
  const openBtns = document.querySelectorAll("[data-open-auth]");
  const closeBtn = document.getElementById("authModalClose");

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const tab = btn.dataset.authTab || "login";
      showAuthTab(tab);
      modal.classList.add("open");
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => modal.classList.remove("open"));
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("open");
  });

  // Tab switching
  document.getElementById("authTabLogin")?.addEventListener("click", () => showAuthTab("login"));
  document.getElementById("authTabRegister")?.addEventListener("click", () => showAuthTab("register"));

  // Forms
  document.getElementById("loginForm")?.addEventListener("submit", handleLogin);
  document.getElementById("registerForm")?.addEventListener("submit", handleRegister);
}

function showAuthTab(tab) {
  document.querySelectorAll(".auth-tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".auth-form").forEach(f => f.classList.remove("active"));
  if (tab === "login") {
    document.getElementById("authTabLogin")?.classList.add("active");
    document.getElementById("loginForm")?.classList.add("active");
  } else {
    document.getElementById("authTabRegister")?.classList.add("active");
    document.getElementById("registerForm")?.classList.add("active");
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const btn = e.target.querySelector("button[type='submit']");
  if (btn) { btn.disabled = true; btn.textContent = "Entrando..."; }

  const email = e.target.querySelector("input[name='email']")?.value;
  const password = e.target.querySelector("input[name='password']")?.value;

  if (!email || !password) {
    if (btn) { btn.disabled = false; btn.textContent = "Entrar"; }
    alert("Email y contraseña requeridos");
    return;
  }

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Error al iniciar sesión");
      if (btn) { btn.disabled = false; btn.textContent = "Entrar"; }
      return;
    }

    // Store session
    localStorage.setItem("wr_session", JSON.stringify(data.session));
    localStorage.setItem("wr_user", JSON.stringify(data.user));

    document.getElementById("authModal")?.classList.remove("open");
    updateAuthUI(data.user);
  } catch (err) {
    alert("Error de conexión");
    if (btn) { btn.disabled = false; btn.textContent = "Entrar"; }
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const btn = e.target.querySelector("button[type='submit']");
  if (btn) { btn.disabled = true; btn.textContent = "Creando cuenta..."; }

  const email = e.target.querySelector("input[name='email']")?.value;
  const password = e.target.querySelector("input[name='password']")?.value;
  const name = e.target.querySelector("input[name='name']")?.value;
  const plan = e.target.querySelector("select[name='plan']")?.value || "starter";

  if (!email || !password) {
    if (btn) { btn.disabled = false; btn.textContent = "Crear cuenta"; }
    alert("Email y contraseña requeridos");
    return;
  }

  if (password.length < 6) {
    if (btn) { btn.disabled = false; btn.textContent = "Crear cuenta"; }
    alert("La contraseña debe tener al menos 6 caracteres");
    return;
  }

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, plan }),
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Error al crear cuenta");
      if (btn) { btn.disabled = false; btn.textContent = "Crear cuenta"; }
      return;
    }

    alert("Cuenta creada. Revisa tu email para confirmar el registro.");
    showAuthTab("login");
    if (btn) { btn.disabled = false; btn.textContent = "Crear cuenta"; }
  } catch (err) {
    alert("Error de conexión");
    if (btn) { btn.disabled = false; btn.textContent = "Crear cuenta"; }
  }
}

function initAuth() {
  const userData = localStorage.getItem("wr_user");
  if (userData) {
    try {
      const user = JSON.parse(userData);
      updateAuthUI(user);
    } catch { /* ignore */ }
  }
}

function updateAuthUI(user) {
  const loginBtns = document.querySelectorAll("[data-open-auth]");
  loginBtns.forEach(btn => {
    if (btn.dataset.authTab === "login") {
      btn.textContent = `👤 ${user.email}`;
      btn.dataset.openAuth = "profile";
      btn.href = "/pro";
    }
  });
  // Update Pro CTA buttons
  document.querySelectorAll(".pricing-card .btn-primary[data-open-auth]").forEach(b => {
    b.textContent = "¡Suscribirse!";
    b.dataset.authTab = "register";
  });
}

// ── Admin Panel ──
async function initAdmin() {
  const container = document.getElementById("adminContent");
  if (!container) return;

  container.innerHTML = `<div style="text-align:center;padding:2rem">Cargando panel de administración...</div>`;

  const serviceKey = localStorage.getItem("wr_admin_key");
  if (!serviceKey) {
    container.innerHTML = `
      <div style="text-align:center;padding:3rem;max-width:400px;margin:0 auto">
        <div style="font-size:3rem;margin-bottom:1rem">🔐</div>
        <h3>Panel de administración</h3>
        <p style="color:var(--text-secondary);margin-bottom:1.5rem">Introduce la clave de administrador para acceder.</p>
        <input type="password" id="adminKeyInput" placeholder="Clave de administrador" style="width:100%;padding:0.75rem 1rem;border-radius:12px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:white;font-size:1rem;margin-bottom:1rem" />
        <button onclick="adminLogin()" class="btn-primary" style="width:100%">Acceder</button>
      </div>
    `;
    return;
  }

  await loadAdminDashboard(serviceKey);
}

window.adminLogin = async function() {
  const input = document.getElementById("adminKeyInput");
  if (!input || !input.value) return;

  const key = input.value.trim();

  // Verify by trying to fetch stats
  try {
    const res = await fetch("/api/admin/stats", {
      headers: { "Authorization": `Bearer ${key}` }
    });
    if (!res.ok) {
      alert("Clave incorrecta");
      return;
    }
    localStorage.setItem("wr_admin_key", key);
    await loadAdminDashboard(key);
  } catch {
    alert("Error de conexión");
  }
};

async function loadAdminDashboard(serviceKey) {
  const container = document.getElementById("adminContent");
  if (!container) return;

  try {
    const res = await fetch("/api/admin/stats", {
      headers: { "Authorization": `Bearer ${serviceKey}` }
    });
    const data = await res.json();

    if (!res.ok) {
      container.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--text-danger)">Error: ${data.error}</div>`;
      return;
    }

    const stats = data.stats;
    container.innerHTML = `
      <div style="margin-bottom:2rem">
        <h2 style="margin:0">📊 Dashboard</h2>
        <p style="color:var(--text-secondary);margin:.5rem 0 0">Resumen de datos de WorldRank</p>
      </div>
      <div class="admin-stats-grid">
        ${Object.values(stats).map(s => `
          <div class="admin-stat-card" onclick="loadAdminTable('${s.label === 'Suscriptores' ? 'newsletter' : s.label === 'Leads de anunciantes' ? 'advertisers' : s.label === 'Usuarios Pro' ? 'pro_users' : 'feedback'}')" style="cursor:pointer">
            <div class="admin-stat-icon">${s.icon}</div>
            <div class="admin-stat-number">${s.total}</div>
            <div class="admin-stat-label">${s.label}</div>
          </div>
        `).join('')}
      </div>
      <div id="adminTableContainer"></div>
    `;
  } catch (err) {
    container.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--text-danger)">Error de conexión: ${err.message}</div>`;
  }
}

window.loadAdminTable = async function(table) {
  const container = document.getElementById("adminTableContainer");
  if (!container) return;

  const key = localStorage.getItem("wr_admin_key");

  container.innerHTML = `<div style="text-align:center;padding:1rem">Cargando...</div>`;

  try {
    const res = await fetch(`/api/admin/data?table=${table}&limit=100`, {
      headers: { "Authorization": `Bearer ${key}` }
    });
    const data = await res.json();

    if (!res.ok || !data.data) {
      container.innerHTML = `<div style="text-align:center;padding:1rem;color:var(--text-danger)">Error: ${data.error || 'No hay datos'}</div>`;
      return;
    }

    const headers = data.data.length > 0 ? Object.keys(data.data[0]) : [];
    const displayHeaders = ['#', ...headers.filter(h => !['id', 'updated_at'].includes(h))];

    container.innerHTML = `
      <div style="margin-top:2rem">
        <h3 style="margin:0 0 1rem">📋 ${data.total} registros en "${table}"</h3>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.85rem">
            <thead>
              <tr style="background:rgba(255,255,255,0.05)">
                ${displayHeaders.map(h => `<th style="padding:0.6rem;text-align:left;white-space:nowrap;color:var(--text-secondary)">${h}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.data.slice(0, 50).map((row, i) => `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05)">
                  ${displayHeaders.map(h => {
                    if (h === '#') return `<td style="padding:0.5rem;color:var(--text-muted)">${i + 1}</td>`;
                    const val = row[h] !== null && row[h] !== undefined ? String(row[h]) : '—';
                    const maxLen = 40;
                    return `<td style="padding:0.5rem;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${val}">${val.length > maxLen ? val.slice(0, maxLen) + '…' : val}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
              ${data.data.length > 50 ? `<tr><td colspan="${displayHeaders.length}" style="padding:0.5rem;text-align:center;color:var(--text-muted)">… y ${data.data.length - 50} más</td></tr>` : ''}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div style="text-align:center;padding:1rem;color:var(--text-danger)">Error: ${err.message}</div>`;
  }
};

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

  // Formulario de anunciantes
  initAdvertiseForm();

  // Auth modal + sesión
  initAuthModal();
  initAuth();

  // Admin (solo si existe la sección)
  if (document.getElementById('page-admin')) {
    initAdmin();
  }
});
