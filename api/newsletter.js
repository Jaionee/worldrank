// Newsletter API — Suscripción
// POST /api/newsletter  →  Registrar suscriptor
// GET  /api/newsletter  →  Listar suscriptores (admin)
const { getClient, getAdminClient, corsHeaders, errorResponse, successResponse, handleOptions } = require('./_supabase.js');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;

  try {
    if (req.method === 'POST') {
      return await subscribe(req, res);
    }
    if (req.method === 'GET') {
      return await listSubscribers(req, res);
    }
    errorResponse(res, 'Method not allowed', 405);
  } catch (err) {
    console.error('Newsletter error:', err);
    errorResponse(res, 'Internal server error', 500);
  }
};

async function subscribe(req, res) {
  let body;
  try {
    body = JSON.parse(req.body);
  } catch {
    // If body is already parsed (Vercel sometimes does this)
    body = req.body || {};
  }

  const { email, interests } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return errorResponse(res, 'Email inválido');
  }

  const supabase = getClient();

  // Check if already subscribed
  const { data: existing } = await supabase
    .from('newsletter')
    .select('id, active')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle();

  if (existing) {
    if (existing.active) {
      return errorResponse(res, 'Ya estás suscrito con este email', 409);
    }
    // Re-activate
    const { error: reactErr } = await supabase
      .from('newsletter')
      .update({ active: true, interests: interests || [] })
      .eq('id', existing.id);
    if (reactErr) throw reactErr;
    return successResponse(res, { message: 'Suscripción reactivada', email: email.toLowerCase().trim() }, 200);
  }

  // New subscription
  const { error: insertErr } = await supabase
    .from('newsletter')
    .insert({
      email: email.toLowerCase().trim(),
      interests: interests || [],
      source: 'web',
    });

  if (insertErr) {
    if (insertErr.code === '23505') {
      return errorResponse(res, 'Ya estás suscrito', 409);
    }
    throw insertErr;
  }

  return successResponse(res, { message: '¡Suscripción exitosa!', email: email.toLowerCase().trim() }, 201);
}

async function listSubscribers(req, res) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ') || auth.slice(7) !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return errorResponse(res, 'Unauthorized', 401);
  }

  const supabase = getAdminClient();
  const url = new URL(req.url, 'https://n');
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const offset = (page - 1) * limit;

  const { data, count, error } = await supabase
    .from('newsletter')
    .select('*', { count: 'exact' })
    .order('subscribed_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return successResponse(res, {
    data,
    total: count,
    page,
    limit,
    pages: Math.ceil((count || 0) / limit),
  });
}
