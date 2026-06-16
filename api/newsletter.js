// ============================================================
// Newsletter API — Suscripción
// POST /api/newsletter  →  Registrar suscriptor
// GET  /api/newsletter  →  Listar suscriptores (admin)
// ============================================================
import { getClient, getAdminClient, corsHeaders, errorResponse, successResponse, handleOptions } from './_supabase.js';

export const config = {
  runtime: 'nodejs18.x',
};

export default async function handler(request) {
  // CORS preflight
  const options = handleOptions(request);
  if (options) return options;

  const url = new URL(request.url);
  const method = request.method;

  try {
    if (method === 'POST') {
      return await subscribe(request);
    }
    if (method === 'GET') {
      return await listSubscribers(request);
    }
    return errorResponse('Method not allowed', 405);
  } catch (err) {
    console.error('Newsletter error:', err);
    return errorResponse('Internal server error', 500);
  }
}

async function subscribe(request) {
  const body = await request.json();
  const { email, interests } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return errorResponse('Email inválido');
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
      return errorResponse('Ya estás suscrito con este email', 409);
    }
    // Re-activate
    const { error: reactErr } = await supabase
      .from('newsletter')
      .update({ active: true, interests: interests || [] })
      .eq('id', existing.id);
    if (reactErr) throw reactErr;
    return successResponse({ message: 'Suscripción reactivada', email: email.toLowerCase().trim() }, 200);
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
      return errorResponse('Ya estás suscrito', 409);
    }
    throw insertErr;
  }

  return successResponse({ message: '¡Suscripción exitosa!', email: email.toLowerCase().trim() }, 201);
}

async function listSubscribers(request) {
  // Admin check via Authorization header (will hold service_role key)
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ') || auth.slice(7) !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return errorResponse('Unauthorized', 401);
  }

  const supabase = getAdminClient();
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const offset = (page - 1) * limit;

  const { data, count, error } = await supabase
    .from('newsletter')
    .select('*', { count: 'exact' })
    .order('subscribed_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return successResponse({
    data,
    total: count,
    page,
    limit,
    pages: Math.ceil((count || 0) / limit),
  });
}
