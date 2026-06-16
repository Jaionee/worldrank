// Advertise API — Leads de anunciantes
const { getClient, getAdminClient, corsHeaders, errorResponse, successResponse, handleOptions } = require('./_supabase.js');

module.exports = async (req, res) => {
  if (handleOptions(req, res)) return;

  try {
    if (req.method === 'POST') {
      return await createLead(req, res);
    }
    if (req.method === 'GET') {
      return await listLeads(req, res);
    }
    errorResponse(res, 'Method not allowed', 405);
  } catch (err) {
    console.error('Advertise error:', err);
    errorResponse(res, 'Internal server error', 500);
  }
};

async function createLead(req, res) {
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const { company, website, email, phone, budget, plan, message } = body;

  if (!email || !company) {
    return errorResponse(res, 'Email y empresa son requeridos');
  }

  const supabase = getClient();
  const { error } = await supabase.from('advertisers').insert({
    company_name: company,
    website: website || '',
    email,
    phone: phone || '',
    budget: budget || '',
    plan: plan || 'starter',
    message: message || '',
  });

  if (error) throw error;
  return successResponse(res, { message: 'Solicitud recibida, te contactaremos pronto' }, 201);
}

async function listLeads(req, res) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ') || auth.slice(7) !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return errorResponse(res, 'Unauthorized', 401);
  }

  const supabase = getAdminClient();
  const { data, error } = await supabase.from('advertisers').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return successResponse(res, { data });
}
