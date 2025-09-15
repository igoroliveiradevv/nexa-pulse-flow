-- Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_razao TEXT NOT NULL,
  cpf_cnpj TEXT,
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  pais TEXT,
  cep TEXT,
  celular TEXT,
  telefone_fixo TEXT,
  whatsapp TEXT,
  email TEXT,
  linkedin TEXT,
  instagram TEXT,
  cargo TEXT,
  empresa TEXT,
  setor_atuacao TEXT,
  tamanho_empresa TEXT,
  origem_lead TEXT,
  interacoes_anteriores TEXT,
  status TEXT DEFAULT 'lead',
  value NUMERIC DEFAULT 0,
  last_contact DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_clients_updated_at ON public.clients;
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS and allow public access for now (no auth yet)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read clients" ON public.clients;
CREATE POLICY "Public read clients" ON public.clients FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert clients" ON public.clients;
CREATE POLICY "Public insert clients" ON public.clients FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update clients" ON public.clients;
CREATE POLICY "Public update clients" ON public.clients FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public delete clients" ON public.clients;
CREATE POLICY "Public delete clients" ON public.clients FOR DELETE USING (true);

-- Activities table to feed Recent Activity
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- e.g., 'client_added', 'client_updated', 'client_deleted', 'task_added'
  entity_type TEXT NOT NULL, -- 'client' | 'task' | 'contract' etc.
  entity_id TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read activities" ON public.activities;
CREATE POLICY "Public read activities" ON public.activities FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert activities" ON public.activities;
CREATE POLICY "Public insert activities" ON public.activities FOR INSERT WITH CHECK (true);

-- Optional: realtime support
ALTER TABLE public.clients REPLICA IDENTITY FULL;
ALTER TABLE public.activities REPLICA IDENTITY FULL;

-- Add to realtime publication
DO $$ BEGIN
  PERFORM 1 FROM pg_publication WHERE pubname = 'supabase_realtime';
  IF FOUND THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.clients, public.activities';
  END IF;
END $$;