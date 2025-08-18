import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Agregado {
  id: string;
  data_inclusao: string;
  data_saida?: string;
  placa_veiculo: string;
  tipo_veiculo: string;
  nome_motorista: string;
  contato_motorista?: string;
  numero_cnh: string;
  categoria_cnh: string;
  validade_cnh: string;
  numero_antt?: string;
  proprietario_veiculo: string;
  contato_proprietario?: string;
  cpf_proprietario?: string;
  rg_proprietario?: string;
  endereco_proprietario?: string;
  escolaridade_proprietario?: string;
  estado_civil_proprietario?: string;
  nome_pai_proprietario?: string;
  escolaridade?: string;
  estado_civil?: string;
  cor_veiculo?: string;
  nome_pai?: string;
  restricoes_rota?: string;
  capacidade_carga_toneladas?: number;
  capacidade_carga_m3?: number;
  porta_lateral?: boolean;
  quantidade_pallets?: number;
  pernoite?: boolean;
  local_pernoite?: string;
  boa_conduta?: boolean;
  pontos_cnh?: number;
  data_detizacao?: string;
  data_vigilancia_sanitaria?: string;
  data_crlv?: string;
  observacoes?: string;
  ativo?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAgregadoData {
  data_inclusao?: string;
  data_saida?: string;
  placa_veiculo: string;
  tipo_veiculo: string;
  nome_motorista: string;
  contato_motorista?: string;
  numero_cnh: string;
  categoria_cnh: string;
  validade_cnh: string;
  numero_antt?: string;
  proprietario_veiculo: string;
  contato_proprietario?: string;
  cpf_proprietario?: string;
  rg_proprietario?: string;
  endereco_proprietario?: string;
  escolaridade_proprietario?: string;
  estado_civil_proprietario?: string;
  nome_pai_proprietario?: string;
  escolaridade?: string;
  estado_civil?: string;
  cor_veiculo?: string;
  nome_pai?: string;
  restricoes_rota?: string;
  capacidade_carga_toneladas?: number;
  capacidade_carga_m3?: number;
  porta_lateral?: boolean;
  quantidade_pallets?: number;
  pernoite?: boolean;
  local_pernoite?: string;
  boa_conduta?: boolean;
  pontos_cnh?: number;
  data_detizacao?: string;
  data_vigilancia_sanitaria?: string;
  data_crlv?: string;
  observacoes?: string;
  ativo?: boolean;
}

export function useAgregados() {
  const [agregados, setAgregados] = useState<Agregado[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAgregados = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('agregados')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgregados(data || []);
    } catch (error) {
      console.error('Erro ao buscar agregados:', error);
      toast({
        title: "Erro ao carregar agregados",
        description: "Não foi possível carregar a lista de agregados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAgregado = async (data: CreateAgregadoData): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('agregados')
        .insert([data]);

      if (error) throw error;

      toast({
        title: "Agregado cadastrado com sucesso!",
        description: `Motorista ${data.nome_motorista} - Veículo ${data.placa_veiculo}`,
      });

      await fetchAgregados();
      return true;
    } catch (error: any) {
      console.error('Erro ao criar agregado:', error);
      toast({
        title: "Erro ao cadastrar agregado",
        description: error.message || "Não foi possível cadastrar o agregado.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateAgregado = async (id: string, data: Partial<CreateAgregadoData>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('agregados')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Agregado atualizado com sucesso!",
        description: "As informações foram atualizadas.",
      });

      await fetchAgregados();
      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar agregado:', error);
      toast({
        title: "Erro ao atualizar agregado",
        description: error.message || "Não foi possível atualizar o agregado.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteAgregado = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('agregados')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Agregado removido com sucesso!",
        description: "O agregado foi removido do sistema.",
      });

      await fetchAgregados();
      return true;
    } catch (error: any) {
      console.error('Erro ao remover agregado:', error);
      toast({
        title: "Erro ao remover agregado",
        description: error.message || "Não foi possível remover o agregado.",
        variant: "destructive",
      });
      return false;
    }
  };

  const getAgregadoById = (id: string): Agregado | undefined => {
    return agregados.find(agregado => agregado.id === id);
  };

  const getAgregadosAtivos = (): Agregado[] => {
    return agregados.filter(agregado => agregado.ativo === true);
  };

  const getAgregadosInativos = (): Agregado[] => {
    return agregados.filter(agregado => agregado.ativo === false);
  };

  const getAgregadosComAlerta = (): Agregado[] => {
    const hoje = new Date();
    const em30Dias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);

    return agregados.filter(agregado => {
      const validadeCNH = new Date(agregado.validade_cnh);
      const validadeCRLV = agregado.data_crlv ? new Date(agregado.data_crlv) : null;

      return validadeCNH <= em30Dias || (validadeCRLV && validadeCRLV <= em30Dias);
    });
  };

  useEffect(() => {
    fetchAgregados();
  }, []);

  return {
    agregados,
    loading,
    createAgregado,
    updateAgregado,
    deleteAgregado,
    getAgregadoById,
    getAgregadosAtivos,
    getAgregadosInativos,
    getAgregadosComAlerta,
    refetch: fetchAgregados,
  };
}