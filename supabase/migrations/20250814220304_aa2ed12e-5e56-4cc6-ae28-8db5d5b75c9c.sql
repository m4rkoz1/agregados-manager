-- Create table for fleet vehicles (agregados)
CREATE TABLE public.agregados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data_inclusao DATE NOT NULL DEFAULT CURRENT_DATE,
  data_saida DATE,
  placa_veiculo VARCHAR(8) NOT NULL UNIQUE,
  tipo_veiculo VARCHAR(50) NOT NULL,
  nome_motorista VARCHAR(255) NOT NULL,
  contato_motorista VARCHAR(20),
  numero_cnh VARCHAR(20) NOT NULL,
  categoria_cnh VARCHAR(5) NOT NULL,
  validade_cnh DATE NOT NULL,
  numero_antt VARCHAR(50),
  proprietario_veiculo VARCHAR(255) NOT NULL,
  contato_proprietario VARCHAR(20),
  escolaridade VARCHAR(100),
  estado_civil VARCHAR(50),
  cor_veiculo VARCHAR(50),
  nome_pai VARCHAR(255),
  restricoes_rota TEXT,
  capacidade_carga_toneladas DECIMAL(8,2),
  capacidade_carga_m3 DECIMAL(8,2),
  porta_lateral BOOLEAN DEFAULT false,
  quantidade_pallets INTEGER,
  pernoite BOOLEAN DEFAULT false,
  local_pernoite VARCHAR(255),
  boa_conduta BOOLEAN DEFAULT true,
  pontos_cnh INTEGER DEFAULT 0,
  data_detizacao DATE,
  data_vigilancia_sanitaria DATE,
  data_crlv DATE,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for change history
CREATE TABLE public.agregados_historico (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agregado_id UUID NOT NULL REFERENCES public.agregados(id) ON DELETE CASCADE,
  campo_alterado VARCHAR(100) NOT NULL,
  valor_anterior TEXT,
  valor_novo TEXT,
  usuario_alteracao VARCHAR(255),
  data_alteracao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.agregados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agregados_historico ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a fleet management system)
CREATE POLICY "Allow all operations on agregados" 
ON public.agregados 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on agregados_historico" 
ON public.agregados_historico 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_agregados_updated_at
  BEFORE UPDATE ON public.agregados
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to log changes
CREATE OR REPLACE FUNCTION public.log_agregado_changes()
RETURNS TRIGGER AS $$
DECLARE
  col_name TEXT;
  old_val TEXT;
  new_val TEXT;
BEGIN
  -- Log changes for specific important fields
  FOR col_name IN 
    SELECT column_name FROM information_schema.columns 
    WHERE table_name = 'agregados' 
    AND column_name NOT IN ('id', 'created_at', 'updated_at')
  LOOP
    EXECUTE format('SELECT ($1).%I::TEXT, ($2).%I::TEXT', col_name, col_name) 
    INTO old_val, new_val 
    USING OLD, NEW;
    
    IF old_val IS DISTINCT FROM new_val THEN
      INSERT INTO public.agregados_historico (
        agregado_id, 
        campo_alterado, 
        valor_anterior, 
        valor_novo
      ) VALUES (
        NEW.id, 
        col_name, 
        old_val, 
        new_val
      );
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for change logging
CREATE TRIGGER log_agregados_changes
  AFTER UPDATE ON public.agregados
  FOR EACH ROW
  EXECUTE FUNCTION public.log_agregado_changes();

-- Create indexes for better performance
CREATE INDEX idx_agregados_placa ON public.agregados(placa_veiculo);
CREATE INDEX idx_agregados_tipo ON public.agregados(tipo_veiculo);
CREATE INDEX idx_agregados_ativo ON public.agregados(ativo);
CREATE INDEX idx_agregados_validade_cnh ON public.agregados(validade_cnh);
CREATE INDEX idx_agregados_data_crlv ON public.agregados(data_crlv);