import { useState, useEffect } from 'react';
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
  esporadico?: boolean;
  foto_veiculo?: string;
  foto_motorista?: string;
  foto_proprietario?: string;
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
  esporadico?: boolean;
  foto_veiculo?: string;
  foto_motorista?: string;
  foto_proprietario?: string;
}

const STORAGE_KEY = 'giannone_agregados';

export function useAgregados() {
  const [agregados, setAgregados] = useState<Agregado[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setAgregados(parsed);
      }
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados salvos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveToStorage = (data: Agregado[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os dados.",
        variant: "destructive",
      });
    }
  };

  const createAgregado = async (data: CreateAgregadoData): Promise<boolean> => {
    try {
      const now = new Date().toISOString();
      const newAgregado: Agregado = {
        ...data,
        id: crypto.randomUUID(),
        data_inclusao: data.data_inclusao || new Date().toISOString().split('T')[0],
        created_at: now,
        updated_at: now,
        ativo: data.ativo !== undefined ? data.ativo : true,
      };

      const updated = [...agregados, newAgregado];
      setAgregados(updated);
      saveToStorage(updated);

      toast({
        title: "Agregado cadastrado com sucesso!",
        description: `Motorista ${data.nome_motorista} - Veículo ${data.placa_veiculo}`,
      });

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
      const updated = agregados.map(agregado =>
        agregado.id === id
          ? { ...agregado, ...data, updated_at: new Date().toISOString() }
          : agregado
      );

      setAgregados(updated);
      saveToStorage(updated);

      toast({
        title: "Agregado atualizado com sucesso!",
        description: "As informações foram atualizadas.",
      });

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
      const updated = agregados.filter(agregado => agregado.id !== id);
      setAgregados(updated);
      saveToStorage(updated);

      toast({
        title: "Agregado removido com sucesso!",
        description: "O agregado foi removido do sistema.",
      });

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
    loadFromStorage();
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
    refetch: loadFromStorage,
  };
}
