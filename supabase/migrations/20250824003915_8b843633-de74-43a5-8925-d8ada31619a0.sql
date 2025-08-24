-- Criar tabela separada para agregados esporádicos
CREATE TABLE public.agregados_esporadicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data_inclusao DATE NOT NULL DEFAULT CURRENT_DATE,
  data_saida DATE NOT NULL, -- Obrigatório para esporádicos
  placa_veiculo VARCHAR NOT NULL,
  tipo_veiculo VARCHAR NOT NULL,
  nome_motorista VARCHAR NOT NULL,
  contato_motorista VARCHAR,
  numero_cnh VARCHAR NOT NULL,
  categoria_cnh VARCHAR NOT NULL,
  validade_cnh DATE NOT NULL,
  numero_antt VARCHAR,
  proprietario_veiculo VARCHAR NOT NULL,
  contato_proprietario VARCHAR,
  cpf_proprietario VARCHAR,
  rg_proprietario VARCHAR,
  endereco_proprietario TEXT,
  escolaridade_proprietario VARCHAR,
  estado_civil_proprietario VARCHAR,
  nome_pai_proprietario VARCHAR,
  escolaridade VARCHAR,
  estado_civil VARCHAR,
  cor_veiculo VARCHAR,
  nome_pai VARCHAR,
  restricoes_rota TEXT,
  capacidade_carga_toneladas NUMERIC,
  capacidade_carga_m3 NUMERIC,
  porta_lateral BOOLEAN DEFAULT false,
  quantidade_pallets INTEGER,
  pernoite BOOLEAN DEFAULT false,
  local_pernoite VARCHAR,
  boa_conduta BOOLEAN DEFAULT true,
  pontos_cnh INTEGER DEFAULT 0,
  data_detizacao DATE,
  data_vigilancia_sanitaria DATE,
  data_crlv DATE,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.agregados_esporadicos ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas as operações (ajustar conforme necessário)
CREATE POLICY "Allow all operations on agregados_esporadicos" 
ON public.agregados_esporadicos 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Criar trigger para updated_at
CREATE TRIGGER update_agregados_esporadicos_updated_at
  BEFORE UPDATE ON public.agregados_esporadicos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Criar tabela para configurações de campos dinâmicos
CREATE TABLE public.campos_configuracao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tabela_nome VARCHAR NOT NULL, -- 'agregados', 'agregados_esporadicos', etc.
  campo_nome VARCHAR NOT NULL,
  campo_label VARCHAR NOT NULL,
  campo_tipo VARCHAR NOT NULL, -- 'text', 'number', 'date', 'select', 'boolean', 'textarea'
  campo_obrigatorio BOOLEAN DEFAULT false,
  campo_opcoes JSONB, -- Para campos do tipo select
  campo_ordem INTEGER DEFAULT 0,
  campo_ativo BOOLEAN DEFAULT true,
  campo_categoria VARCHAR, -- Para agrupar campos
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tabela_nome, campo_nome)
);

-- Habilitar RLS
ALTER TABLE public.campos_configuracao ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas as operações
CREATE POLICY "Allow all operations on campos_configuracao" 
ON public.campos_configuracao 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Criar trigger para updated_at
CREATE TRIGGER update_campos_configuracao_updated_at
  BEFORE UPDATE ON public.campos_configuracao
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir configurações padrão para agregados esporádicos
INSERT INTO public.campos_configuracao (tabela_nome, campo_nome, campo_label, campo_tipo, campo_obrigatorio, campo_ordem, campo_categoria) VALUES
-- Período
('agregados_esporadicos', 'data_inclusao', 'Data de Inclusão', 'date', true, 1, 'periodo'),
('agregados_esporadicos', 'data_saida', 'Data de Saída', 'date', true, 2, 'periodo'),

-- Veículo
('agregados_esporadicos', 'placa_veiculo', 'Placa do Veículo', 'text', true, 10, 'veiculo'),
('agregados_esporadicos', 'tipo_veiculo', 'Tipo do Veículo', 'select', true, 11, 'veiculo'),
('agregados_esporadicos', 'cor_veiculo', 'Cor do Veículo', 'text', false, 12, 'veiculo'),
('agregados_esporadicos', 'capacidade_carga_toneladas', 'Capacidade de Carga (ton)', 'number', false, 13, 'veiculo'),
('agregados_esporadicos', 'capacidade_carga_m3', 'Capacidade de Carga (m³)', 'number', false, 14, 'veiculo'),
('agregados_esporadicos', 'quantidade_pallets', 'Quantidade de Pallets', 'number', false, 15, 'veiculo'),
('agregados_esporadicos', 'porta_lateral', 'Porta Lateral', 'boolean', false, 16, 'veiculo'),

-- Motorista
('agregados_esporadicos', 'nome_motorista', 'Nome do Motorista', 'text', true, 20, 'motorista'),
('agregados_esporadicos', 'contato_motorista', 'Contato do Motorista', 'text', false, 21, 'motorista'),
('agregados_esporadicos', 'numero_cnh', 'Número da CNH', 'text', true, 22, 'motorista'),
('agregados_esporadicos', 'categoria_cnh', 'Categoria da CNH', 'select', true, 23, 'motorista'),
('agregados_esporadicos', 'validade_cnh', 'Validade da CNH', 'date', true, 24, 'motorista'),
('agregados_esporadicos', 'pontos_cnh', 'Pontos na CNH', 'number', false, 25, 'motorista'),
('agregados_esporadicos', 'escolaridade', 'Escolaridade', 'select', false, 26, 'motorista'),
('agregados_esporadicos', 'estado_civil', 'Estado Civil', 'select', false, 27, 'motorista'),
('agregados_esporadicos', 'nome_pai', 'Nome do Pai', 'text', false, 28, 'motorista'),

-- Proprietário
('agregados_esporadicos', 'proprietario_veiculo', 'Nome do Proprietário', 'text', true, 30, 'proprietario'),
('agregados_esporadicos', 'contato_proprietario', 'Contato do Proprietário', 'text', false, 31, 'proprietario'),
('agregados_esporadicos', 'cpf_proprietario', 'CPF do Proprietário', 'text', false, 32, 'proprietario'),
('agregados_esporadicos', 'rg_proprietario', 'RG do Proprietário', 'text', false, 33, 'proprietario'),
('agregados_esporadicos', 'endereco_proprietario', 'Endereço do Proprietário', 'textarea', false, 34, 'proprietario'),
('agregados_esporadicos', 'escolaridade_proprietario', 'Escolaridade do Proprietário', 'select', false, 35, 'proprietario'),
('agregados_esporadicos', 'estado_civil_proprietario', 'Estado Civil do Proprietário', 'select', false, 36, 'proprietario'),
('agregados_esporadicos', 'nome_pai_proprietario', 'Nome do Pai do Proprietário', 'text', false, 37, 'proprietario'),

-- Documentos
('agregados_esporadicos', 'numero_antt', 'Número ANTT', 'text', false, 40, 'documentos'),
('agregados_esporadicos', 'data_detizacao', 'Data Detização', 'date', false, 41, 'documentos'),
('agregados_esporadicos', 'data_vigilancia_sanitaria', 'Data Vigilância Sanitária', 'date', false, 42, 'documentos'),
('agregados_esporadicos', 'data_crlv', 'Data CRLV', 'date', false, 43, 'documentos'),

-- Operacional
('agregados_esporadicos', 'restricoes_rota', 'Restrições de Rota', 'textarea', false, 50, 'operacional'),
('agregados_esporadicos', 'pernoite', 'Pernoite', 'boolean', false, 51, 'operacional'),
('agregados_esporadicos', 'local_pernoite', 'Local de Pernoite', 'text', false, 52, 'operacional'),
('agregados_esporadicos', 'boa_conduta', 'Boa Conduta', 'boolean', false, 53, 'operacional'),
('agregados_esporadicos', 'observacoes', 'Observações', 'textarea', false, 54, 'operacional');

-- Atualizar campos do tipo select com suas opções
UPDATE public.campos_configuracao SET campo_opcoes = '["3/4", "Toco", "Truck", "Carreta", "Van", "Bitrem", "Rodotrem"]'::jsonb 
WHERE campo_nome = 'tipo_veiculo';

UPDATE public.campos_configuracao SET campo_opcoes = '["A", "B", "C", "D", "E", "AB", "AC", "AD", "AE"]'::jsonb 
WHERE campo_nome = 'categoria_cnh';

UPDATE public.campos_configuracao SET campo_opcoes = '["Fundamental Incompleto", "Fundamental Completo", "Médio Incompleto", "Médio Completo", "Superior Incompleto", "Superior Completo", "Pós-graduação"]'::jsonb 
WHERE campo_nome IN ('escolaridade', 'escolaridade_proprietario');

UPDATE public.campos_configuracao SET campo_opcoes = '["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)", "União Estável"]'::jsonb 
WHERE campo_nome IN ('estado_civil', 'estado_civil_proprietario');