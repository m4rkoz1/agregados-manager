import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CampoConfiguracao {
  id: string;
  tabela_nome: string;
  campo_nome: string;
  campo_label: string;
  campo_tipo: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'textarea';
  campo_obrigatorio: boolean;
  campo_opcoes?: string[];
  campo_ordem: number;
  campo_ativo: boolean;
  campo_categoria?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCampoConfiguracao {
  tabela_nome: string;
  campo_nome: string;
  campo_label: string;
  campo_tipo: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'textarea';
  campo_obrigatorio?: boolean;
  campo_opcoes?: string[];
  campo_ordem?: number;
  campo_ativo?: boolean;
  campo_categoria?: string;
}

export function useCamposConfiguracao() {
  const [campos, setCampos] = useState<CampoConfiguracao[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCampos = async (tabelaNome?: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from('campos_configuracao')
        .select('*')
        .order('campo_ordem', { ascending: true });

      if (tabelaNome) {
        query = query.eq('tabela_nome', tabelaNome);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Converter campo_opcoes de JSONB para array e garantir tipos corretos
      const camposFormatados = (data || []).map(campo => ({
        ...campo,
        campo_opcoes: Array.isArray(campo.campo_opcoes) ? campo.campo_opcoes as string[] : [],
        campo_tipo: campo.campo_tipo as 'text' | 'number' | 'date' | 'select' | 'boolean' | 'textarea',
        campo_obrigatorio: campo.campo_obrigatorio || false,
        campo_ativo: campo.campo_ativo || false,
        campo_categoria: campo.campo_categoria || undefined
      }));
      
      setCampos(camposFormatados);
    } catch (error) {
      console.error('Erro ao buscar campos de configuração:', error);
      toast({
        title: "Erro ao carregar configuração de campos",
        description: "Não foi possível carregar a configuração dos campos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCampo = async (data: CreateCampoConfiguracao): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('campos_configuracao')
        .insert([{
          ...data,
          campo_opcoes: data.campo_opcoes || []
        }]);

      if (error) throw error;

      toast({
        title: "Campo adicionado com sucesso!",
        description: `Campo "${data.campo_label}" foi adicionado à tabela ${data.tabela_nome}`,
      });

      await fetchCampos();
      return true;
    } catch (error: any) {
      console.error('Erro ao criar campo:', error);
      toast({
        title: "Erro ao adicionar campo",
        description: error.message || "Não foi possível adicionar o campo.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateCampo = async (id: string, data: Partial<CreateCampoConfiguracao>): Promise<boolean> => {
    try {
      const updateData: any = { ...data };
      if (updateData.campo_opcoes) {
        updateData.campo_opcoes = updateData.campo_opcoes;
      }

      const { error } = await supabase
        .from('campos_configuracao')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Campo atualizado com sucesso!",
        description: "As configurações do campo foram atualizadas.",
      });

      await fetchCampos();
      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar campo:', error);
      toast({
        title: "Erro ao atualizar campo",
        description: error.message || "Não foi possível atualizar o campo.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteCampo = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('campos_configuracao')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Campo removido com sucesso!",
        description: "O campo foi removido da configuração.",
      });

      await fetchCampos();
      return true;
    } catch (error: any) {
      console.error('Erro ao remover campo:', error);
      toast({
        title: "Erro ao remover campo",
        description: error.message || "Não foi possível remover o campo.",
        variant: "destructive",
      });
      return false;
    }
  };

  const getCamposByTabela = (tabelaNome: string): CampoConfiguracao[] => {
    return campos.filter(campo => campo.tabela_nome === tabelaNome && campo.campo_ativo);
  };

  const getCamposByCategoria = (tabelaNome: string, categoria: string): CampoConfiguracao[] => {
    return campos.filter(
      campo => 
        campo.tabela_nome === tabelaNome && 
        campo.campo_categoria === categoria && 
        campo.campo_ativo
    );
  };

  const getCategorias = (tabelaNome: string): string[] => {
    const categorias = campos
      .filter(campo => campo.tabela_nome === tabelaNome && campo.campo_ativo)
      .map(campo => campo.campo_categoria)
      .filter(Boolean) as string[];
    
    return [...new Set(categorias)];
  };

  const reordernarCampos = async (camposReordenados: { id: string; ordem: number }[]): Promise<boolean> => {
    try {
      const updates = camposReordenados.map(({ id, ordem }) => 
        supabase
          .from('campos_configuracao')
          .update({ campo_ordem: ordem })
          .eq('id', id)
      );

      const results = await Promise.all(updates);
      
      for (const result of results) {
        if (result.error) throw result.error;
      }

      toast({
        title: "Campos reordenados com sucesso!",
        description: "A ordem dos campos foi atualizada.",
      });

      await fetchCampos();
      return true;
    } catch (error: any) {
      console.error('Erro ao reordenar campos:', error);
      toast({
        title: "Erro ao reordenar campos",
        description: error.message || "Não foi possível reordenar os campos.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchCampos();
  }, []);

  return {
    campos,
    loading,
    createCampo,
    updateCampo,
    deleteCampo,
    getCamposByTabela,
    getCamposByCategoria,
    getCategorias,
    reordernarCampos,
    refetch: fetchCampos,
  };
}