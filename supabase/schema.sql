-- ============================================================
-- WorldRank — Esquema de base de datos (Supabase/PostgreSQL)
-- ============================================================

-- 1. NEWSLETTER — Suscriptores
CREATE TABLE IF NOT EXISTS newsletter (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  interests TEXT[] DEFAULT '{}',
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  active BOOLEAN DEFAULT true,
  source TEXT DEFAULT 'web'
);

-- 2. ANUNCIANTES — Leads de publicidad
CREATE TABLE IF NOT EXISTS advertisers (
  id BIGSERIAL PRIMARY KEY,
  company_name TEXT NOT NULL,
  website TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  budget TEXT,
  plan TEXT DEFAULT 'starter',
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'new'
);

-- 3. USUARIOS PRO — Extiende auth.users de Supabase
CREATE TABLE IF NOT EXISTS pro_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'business', 'enterprise')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT true
);

-- 4. FEEDBACK / CONTACTO
CREATE TABLE IF NOT EXISTS feedback (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  email TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Índices
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed ON newsletter(subscribed_at DESC);
CREATE INDEX IF NOT EXISTS idx_advertisers_status ON advertisers(status);
CREATE INDEX IF NOT EXISTS idx_advertisers_created ON advertisers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pro_users_plan ON pro_users(plan);

-- ============================================================
-- Row Level Security (RLS) — Admin only by default
-- ============================================================
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pro_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Admin can do everything (by email domain or role)
CREATE POLICY admin_all_newsletter ON newsletter
  FOR ALL USING (auth.jwt() ->> 'email' = 'jaione@worldrank.app');

CREATE POLICY admin_all_advertisers ON advertisers
  FOR ALL USING (auth.jwt() ->> 'email' = 'jaione@worldrank.app');

CREATE POLICY admin_all_pro_users ON pro_users
  FOR ALL USING (auth.jwt() ->> 'email' = 'jaione@worldrank.app');

CREATE POLICY admin_all_feedback ON feedback
  FOR ALL USING (auth.jwt() ->> 'email' = 'jaione@worldrank.app');

-- Public can INSERT into newsletter (subscription)
CREATE POLICY public_insert_newsletter ON newsletter
  FOR INSERT WITH CHECK (true);

-- Public can INSERT into advertisers
CREATE POLICY public_insert_advertisers ON advertisers
  FOR INSERT WITH CHECK (true);
