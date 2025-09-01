-- Alterações na tabela agregados

-- DADOS DO PROPRIETÁRIO: Adicionar novos campos
ALTER TABLE public.agregados 
ADD COLUMN pis_proprietario character varying,
ADD COLUMN ressalva_proprietario text,
ADD COLUMN nome_referencia_proprietario character varying,
ADD COLUMN contato_referencia_proprietario character varying;

-- DADOS DO MOTORISTA: Remover campos desnecessários
ALTER TABLE public.agregados 
DROP COLUMN pontos_cnh,
DROP COLUMN escolaridade,
DROP COLUMN estado_civil,
DROP COLUMN nome_pai;

-- DADOS DO MOTORISTA: Adicionar novos campos
ALTER TABLE public.agregados 
ADD COLUMN ressalva_motorista text,
ADD COLUMN nome_referencia_motorista character varying,
ADD COLUMN contato_referencia_motorista character varying;

-- INFORMAÇÕES OPERACIONAIS: Remover campos desnecessários
ALTER TABLE public.agregados 
DROP COLUMN local_pernoite,
DROP COLUMN porta_lateral;

-- INFORMAÇÕES OPERACIONAIS: Adicionar novos campos
ALTER TABLE public.agregados 
ADD COLUMN viagem boolean DEFAULT false,
ADD COLUMN rastreador boolean DEFAULT false,
ADD COLUMN quantidade_palete_operacional integer,
ADD COLUMN capacidade_carga_operacional numeric;

-- DADOS DO VEÍCULO: Remover campos movidos para operacionais
ALTER TABLE public.agregados 
DROP COLUMN capacidade_carga_toneladas,
DROP COLUMN capacidade_carga_m3,
DROP COLUMN quantidade_pallets;

-- Fazer as mesmas alterações na tabela agregados_esporadicos para manter consistência

-- DADOS DO PROPRIETÁRIO: Adicionar novos campos
ALTER TABLE public.agregados_esporadicos 
ADD COLUMN pis_proprietario character varying,
ADD COLUMN ressalva_proprietario text,
ADD COLUMN nome_referencia_proprietario character varying,
ADD COLUMN contato_referencia_proprietario character varying;

-- DADOS DO MOTORISTA: Remover campos desnecessários
ALTER TABLE public.agregados_esporadicos 
DROP COLUMN pontos_cnh,
DROP COLUMN escolaridade,
DROP COLUMN estado_civil,
DROP COLUMN nome_pai;

-- DADOS DO MOTORISTA: Adicionar novos campos
ALTER TABLE public.agregados_esporadicos 
ADD COLUMN ressalva_motorista text,
ADD COLUMN nome_referencia_motorista character varying,
ADD COLUMN contato_referencia_motorista character varying;

-- INFORMAÇÕES OPERACIONAIS: Remover campos desnecessários
ALTER TABLE public.agregados_esporadicos 
DROP COLUMN local_pernoite,
DROP COLUMN porta_lateral;

-- INFORMAÇÕES OPERACIONAIS: Adicionar novos campos
ALTER TABLE public.agregados_esporadicos 
ADD COLUMN viagem boolean DEFAULT false,
ADD COLUMN rastreador boolean DEFAULT false,
ADD COLUMN quantidade_palete_operacional integer,
ADD COLUMN capacidade_carga_operacional numeric;

-- DADOS DO VEÍCULO: Remover campos movidos para operacionais
ALTER TABLE public.agregados_esporadicos 
DROP COLUMN capacidade_carga_toneladas,
DROP COLUMN capacidade_carga_m3,
DROP COLUMN quantidade_pallets;