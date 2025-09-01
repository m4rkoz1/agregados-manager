import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EsporadicoAgregado {
  id: string;
  data_inclusao: string;
  data_saida: string;
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
  pis_proprietario?: string;
  ressalva_proprietario?: string;
  nome_referencia_proprietario?: string;
  contato_referencia_proprietario?: string;
  ressalva_motorista?: string;
  nome_referencia_motorista?: string;
  contato_referencia_motorista?: string;
  cor_veiculo?: string;
  restricoes_rota?: string;
  pernoite?: boolean;
  boa_conduta?: boolean;
  viagem?: boolean;
  rastreador?: boolean;
  quantidade_palete_operacional?: number;
  capacidade_carga_operacional?: number;
  data_detizacao?: string;
  data_vigilancia_sanitaria?: string;
  data_crlv?: string;
  observacoes?: string;
  ativo?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateEsporadicoData {
  data_inclusao: string;
  data_saida: string;
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
  pis_proprietario?: string;
  ressalva_proprietario?: string;
  nome_referencia_proprietario?: string;
  contato_referencia_proprietario?: string;
  ressalva_motorista?: string;
  nome_referencia_motorista?: string;
  contato_referencia_motorista?: string;
  cor_veiculo?: string;
  restricoes_rota?: string;
  pernoite?: boolean;
  boa_conduta?: boolean;
  viagem?: boolean;
  rastreador?: boolean;
  quantidade_palete_operacional?: number;
  capacidade_carga_operacional?: number;
  data_detizacao?: string;
  data_vigilancia_sanitaria?: string;
  data_crlv?: string;
  observacoes?: string;
  ativo?: boolean;
}

export function useEsporadicosAgregados() {
  const [esporadicos, setEsporadicos] = useState<EsporadicoAgregado[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEsporadicos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('agregados_esporadicos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEsporadicos(data || []);
    } catch (error) {
      console.error('Erro ao buscar agregados esporádicos:', error);
      toast({
        title: "Erro ao carregar agregados esporádicos",
        description: "Não foi possível carregar a lista de agregados esporádicos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createEsporadico = async (data: CreateEsporadicoData): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('agregados_esporadicos')
        .insert([data]);

      if (error) throw error;

      toast({
        title: "Agregado esporádico cadastrado com sucesso!",
        description: `Motorista ${data.nome_motorista} - Veículo ${data.placa_veiculo}`,
      });

      await fetchEsporadicos();
      return true;
    } catch (error: any) {
      console.error('Erro ao criar agregado esporádico:', error);
      toast({
        title: "Erro ao cadastrar agregado esporádico",
        description: error.message || "Não foi possível cadastrar o agregado esporádico.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateEsporadico = async (id: string, data: Partial<CreateEsporadicoData>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('agregados_esporadicos')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Agregado esporádico atualizado com sucesso!",
        description: "As informações foram atualizadas.",
      });

      await fetchEsporadicos();
      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar agregado esporádico:', error);
      toast({
        title: "Erro ao atualizar agregado esporádico",
        description: error.message || "Não foi possível atualizar o agregado esporádico.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteEsporadico = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('agregados_esporadicos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Agregado esporádico removido com sucesso!",
        description: "O agregado esporádico foi removido do sistema.",
      });

      await fetchEsporadicos();
      return true;
    } catch (error: any) {
      console.error('Erro ao remover agregado esporádico:', error);
      toast({
        title: "Erro ao remover agregado esporádico",
        description: error.message || "Não foi possível remover o agregado esporádico.",
        variant: "destructive",
      });
      return false;
    }
  };

  const getEsporadicoById = (id: string): EsporadicoAgregado | undefined => {
    return esporadicos.find(esporadico => esporadico.id === id);
  };

  const getEsporadicosAtivos = (): EsporadicoAgregado[] => {
    return esporadicos.filter(esporadico => esporadico.ativo === true);
  };

  const getEsporadicosInativos = (): EsporadicoAgregado[] => {
    return esporadicos.filter(esporadico => esporadico.ativo === false);
  };

  const getEsporadicosComAlerta = (): EsporadicoAgregado[] => {
    const hoje = new Date();
    const em30Dias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);

    return esporadicos.filter(esporadico => {
      const validadeCNH = new Date(esporadico.validade_cnh);
      const validadeCRLV = esporadico.data_crlv ? new Date(esporadico.data_crlv) : null;

      return validadeCNH <= em30Dias || (validadeCRLV && validadeCRLV <= em30Dias);
    });
  };

  useEffect(() => {
    fetchEsporadicos();
  }, []);

  return {
    esporadicos,
    loading,
    createEsporadico,
    updateEsporadico,
    deleteEsporadico,
    getEsporadicoById,
    getEsporadicosAtivos,
    getEsporadicosInativos,
    getEsporadicosComAlerta,
    refetch: fetchEsporadicos,
  };
}