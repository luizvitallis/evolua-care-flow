-- ============================================================
-- EVOLUA Care Flow — Schema Supabase
-- Execute este SQL no Supabase: SQL Editor → New query
-- ============================================================

-- Tabela de usuários
CREATE TABLE app_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT,
  app_role TEXT DEFAULT 'usuario',
  is_active BOOLEAN DEFAULT true,
  subscription_status TEXT DEFAULT 'active',
  subscription_expires TIMESTAMPTZ,
  profile TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de evoluções clínicas
CREATE TABLE evolutions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  text TEXT,
  profile TEXT,
  environment TEXT,
  template_name TEXT,
  patient_name TEXT,
  app_user_id UUID REFERENCES app_users(id) ON DELETE CASCADE,
  app_user_name TEXT
);

-- Desabilitar RLS (o app usa sua própria autenticação)
ALTER TABLE app_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE evolutions DISABLE ROW LEVEL SECURITY;

-- Criar usuário admin inicial (troque a senha depois)
INSERT INTO app_users (username, password, full_name, app_role, is_active, subscription_status, profile)
VALUES ('admin', 'admin123', 'Administrador', 'admin', true, 'active', 'medico');
