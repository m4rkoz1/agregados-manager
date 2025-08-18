-- Adicionar campos adicionais para dados do proprietário
ALTER TABLE public.agregados 
ADD COLUMN IF NOT EXISTS cpf_proprietario character varying,
ADD COLUMN IF NOT EXISTS rg_proprietario character varying,
ADD COLUMN IF NOT EXISTS endereco_proprietario text,
ADD COLUMN IF NOT EXISTS escolaridade_proprietario character varying,
ADD COLUMN IF NOT EXISTS estado_civil_proprietario character varying,
ADD COLUMN IF NOT EXISTS nome_pai_proprietario character varying;