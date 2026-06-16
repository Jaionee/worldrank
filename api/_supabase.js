// ============================================================
// Supabase client — shared by all API endpoints
// ============================================================
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Public client (RLS-enforced)
export function getClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Admin client (bypasses RLS)
export function getAdminClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

// Auth helpers
export function corsHeaders(origin = '*') {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };
}

export function errorResponse(message, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: corsHeaders(),
  });
}

export function successResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(),
  });
}

// CORS preflight handler
export function handleOptions(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(),
    });
  }
  return null;
}
