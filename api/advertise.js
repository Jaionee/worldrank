// ============================================================
// Advertise API — Leads de anunciantes
// POST /api/advertise  →  Enviar solicitud
// GET  /api/advertise   →  Listar leads (admin)
// ============================================================
import { getClient, getAdminClient, corsHeaders, errorResponse, successResponse, handleOptions } from './_supabase.js';

export const config = {
  runtime: 'nodejs18.x',
};

export default async function handler(request) {
  const options = handleOptions(request);
  if (options) return options;

  const method = request.method;

  try {
    if (method === 'POST') return await createLead(request);
    if (method === 'GET') return await listLeads(request);
    return errorResponse('Method not allowed', 405);
  } catch (err) {
    console.error('Advertise error:', err);
    return errorResponse('Internal server error', 500);
  }
}

async function createLead(request) {
  const body = await request.json();
  const { company_name, website, email, phone, budget, plan, message } = body;

  if (!company_name || !email) {
    return errorResponse('Nombre de empresa y email son obligatorios');
  }

  const supabase = getClient();
  const { error: insertErr } = await supabase
    .from('advertisers')
    .insert({
      company_name: company_name.trim(),
      website: website?.trim() || '',
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || '',
      budget: budget?.trim() || '',
      plan: plan || 'starter',
      message: message?.trim() || '',
      status: 'new',
    });

  if (insertErr) throw insertErr;

  return successResponse({ message: '¡Solicitud recibida! Te contactaremos pronto.' }, 201);
}

async function listLeads(request) {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ') || auth.slice(7) !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return errorResponse('Unauthorized', 401);
  }

  const supabase = getAdminClient();
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const offset = (page - 1) * limit;
  const status = url.searchParams.get('status');

  let query = supabase
    .from('advertisers')
    .select('*', { count: 'exact' });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
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
