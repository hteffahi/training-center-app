-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Candidates table
CREATE TABLE IF NOT EXISTS public.candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255) NOT NULL,
  date_naissance DATE NOT NULL,
  lieu_naissance VARCHAR(255) NOT NULL,
  sexe VARCHAR(50) NOT NULL CHECK (sexe IN ('Masculin', 'Féminin')),
  numero_cnaps VARCHAR(50),
  niveau_etudes VARCHAR(255),
  situation_professionnelle VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_type VARCHAR(50) NOT NULL CHECK (payment_type IN ('acompte', 'solde')),
  mode VARCHAR(100) NOT NULL CHECK (mode IN ('CPF', 'Espèces', 'Virement FSIS', 'Habilitation')),
  date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes
CREATE INDEX idx_candidates_session_id ON public.candidates(session_id);
CREATE INDEX idx_payments_candidate_id ON public.payments(candidate_id);
CREATE INDEX idx_payments_date ON public.payments(date);

-- RLS Policies
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Allow all operations (for development)
-- In production, implement proper auth policies
CREATE POLICY "sessions_all" ON public.sessions
  FOR ALL USING (TRUE);

CREATE POLICY "candidates_all" ON public.candidates
  FOR ALL USING (TRUE);

CREATE POLICY "payments_all" ON public.payments
  FOR ALL USING (TRUE);
