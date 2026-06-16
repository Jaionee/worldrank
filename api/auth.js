// ============================================================
// Auth API — Registro Pro
// POST /api/auth/register  →  Crear cuenta
// POST /api/auth/login     →  Iniciar sesión
// GET  /api/auth/me        →  Perfil actual
// ============================================================
import { getClient, getAdminClient, corsHeaders, errorResponse, successResponse, handleOptions } from '../_supabase.js';

export const config = {
  runtime: 'nodejs18.x',
};

export default async function handler(request) {
  const options = handleOptions(request);
  if (options) return options;

  const url = new URL(request.url);
  const path = url.pathname.replace('/api/auth/', '').replace(/\/$/, '');
  const method = request.method;

  try {
    if (path === 'register' && method === 'POST') return await register(request);
    if (path === 'login' && method === 'POST') return await login(request);
    if (path === 'me' && method === 'GET') return await getProfile(request);
    return errorResponse('Not found', 404);
  } catch (err) {
    console.error('Auth error:', err);
    return errorResponse('Internal server error', 500);
  }
}

async function register(request) {
  const body = await request.json();
  const { email, password, name, plan } = body;

  if (!email || !password) {
    return errorResponse('Email y contraseña son obligatorios');
  }
  if (password.length < 6) {
    return errorResponse('La contraseña debe tener al menos 6 caracteres');
  }

  const supabase = getClient();

  // Create auth user
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email: email.toLowerCase().trim(),
    password,
    options: {
      data: { name: name || '', plan: plan || 'starter' },
    },
  });

  if (authErr) {
    if (authErr.message?.includes('already registered')) {
      return errorResponse('Este email ya está registrado', 409);
    }
    throw authErr;
  }

  if (!authData.user) {
    return errorResponse('Error al crear usuario', 500);
  }

  // Create pro_user record
  const adminClient = getAdminClient();
  const { error: proErr } = await adminClient
    .from('pro_users')
    .insert({
      id: authData.user.id,
      plan: plan || 'starter',
      active: true,
    });

  if (proErr) {
    console.error('Error creating pro_user record:', proErr);
    // Non-fatal — auth user exists
  }

  return successResponse({
    message: 'Cuenta creada. Revisa tu email para confirmar.',
    user: {
      id: authData.user.id,
      email: authData.user.email,
    },
  }, 201);
}

async function login(request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return errorResponse('Email y contraseña son obligatorios');
  }

  const supabase = getClient();
  const { data, error: authErr } = await supabase.auth.signInWithPassword({
    email: email.toLowerCase().trim(),
    password,
  });

  if (authErr) {
    return errorResponse('Email o contraseña incorrectos', 401);
  }

  return successResponse({
    message: 'Inicio de sesión exitoso',
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    },
    user: {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || '',
      plan: data.user.user_metadata?.plan || 'starter',
    },
  });
}

async function getProfile(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return errorResponse('No autorizado', 401);
  }

  const supabase = getClient();
  const token = authHeader.slice(7);

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return errorResponse('Token inválido o expirado', 401);
  }

  // Get pro plan details
  const adminClient = getAdminClient();
  const { data: pro } = await adminClient
    .from('pro_users')
    .select('*')
    .eq('id', user.id)
    .single();

  return successResponse({
    user: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || '',
      plan: pro?.plan || 'starter',
      subscribed_at: pro?.subscribed_at,
      expires_at: pro?.expires_at,
      active: pro?.active ?? true,
    },
  });
}
