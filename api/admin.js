// ============================================================
// Admin API — Dashboard de administración
// GET /api/admin/stats   →  Resumen de datos
// GET /api/admin/data    →  Datos de una tabla específica
// ============================================================
import { getAdminClient, corsHeaders, errorResponse, successResponse, handleOptions } from '../_supabase.js';

export const config = {
  runtime: 'nodejs18.x',
};

export default async function handler(request) {
  const options = handleOptions(request);
  if (options) return options;

  // Auth check — must have service role key
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ') || auth.slice(7) !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return errorResponse('Unauthorized', 401);
  }

  const url = new URL(request.url);
  const path = url.pathname.replace('/api/admin/', '').replace(/\/$/, '');
  const method = request.method;

  try {
    if (path === 'stats' && method === 'GET') return await getStats();
    if (path === 'data' && method === 'GET') return await getTableData(url);
    return errorResponse('Not found', 404);
  } catch (err) {
    console.error('Admin error:', err);
    return errorResponse('Internal server error', 500);
  }
}

async function getStats() {
  const supabase = getAdminClient();

  const [newsletter, advertisers, proUsers, feedback] = await Promise.all([
    supabase.from('newsletter').select('id', { count: 'exact', head: true }),
    supabase.from('advertisers').select('id', { count: 'exact', head: true }),
    supabase.from('pro_users').select('id', { count: 'exact', head: true }),
    supabase.from('feedback').select('id', { count: 'exact', head: true }),
  ]);

  return successResponse({
    stats: {
      newsletter: {
        total: newsletter.count || 0,
        label: 'Suscriptores',
        icon: '📬',
      },
      advertisers: {
        total: advertisers.count || 0,
        label: 'Leads de anunciantes',
        icon: '💼',
      },
      proUsers: {
        total: proUsers.count || 0,
        label: 'Usuarios Pro',
        icon: '⭐',
      },
      feedback: {
        total: feedback.count || 0,
        label: 'Mensajes',
        icon: '💬',
      },
    },
  });
}

async function getTableData(url) {
  const table = url.searchParams.get('table');
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  const allowed = ['newsletter', 'advertisers', 'pro_users', 'feedback'];
  if (!allowed.includes(table)) {
    return errorResponse(`Tabla no permitida. Usa: ${allowed.join(', ')}`);
  }

  const supabase = getAdminClient();
  const { data, count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false, nullsLast: true })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return successResponse({
    data,
    total: count,
    page,
    limit,
    pages: Math.ceil((count || 0) / limit),
    table,
  });
}
