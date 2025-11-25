import { useState, useEffect } from 'react';

export interface CrmLembrete {
  id: string;
  titulo: string;
  descricao?: string;
  dataHora: string;
  leadId?: string;
  leadNome?: string;
  concluido: boolean;
  tipo: 'ligacao' | 'reuniao' | 'email' | 'visita' | 'outro';
  createdAt: string;
  updatedAt: string;
}

export interface CreateCrmLembreteData {
  titulo: string;
  descricao?: string;
  dataHora: string;
  leadId?: string;
  leadNome?: string;
  tipo?: 'ligacao' | 'reuniao' | 'email' | 'visita' | 'outro';
}

const STORAGE_KEY = 'crm_lembretes';

export function useCrmLembretes() {
  const [lembretes, setLembretes] = useState<CrmLembrete[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Erro ao carregar lembretes:', error);
    }
    return [];
  };

  const saveToStorage = (data: CrmLembrete[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar lembretes:', error);
    }
  };

  useEffect(() => {
    const loadedLembretes = loadFromStorage();
    setLembretes(loadedLembretes);
    setLoading(false);
  }, []);

  const createLembrete = async (data: CreateCrmLembreteData): Promise<boolean> => {
    try {
      const newLembrete: CrmLembrete = {
        id: crypto.randomUUID(),
        titulo: data.titulo,
        descricao: data.descricao,
        dataHora: data.dataHora,
        leadId: data.leadId,
        leadNome: data.leadNome,
        concluido: false,
        tipo: data.tipo || 'outro',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedLembretes = [...lembretes, newLembrete];
      setLembretes(updatedLembretes);
      saveToStorage(updatedLembretes);
      return true;
    } catch (error) {
      console.error('Erro ao criar lembrete:', error);
      return false;
    }
  };

  const updateLembrete = async (id: string, data: Partial<CrmLembreteData>): Promise<boolean> => {
    try {
      const updatedLembretes = lembretes.map(lembrete =>
        lembrete.id === id
          ? {
              ...lembrete,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : lembrete
      );
      setLembretes(updatedLembretes);
      saveToStorage(updatedLembretes);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar lembrete:', error);
      return false;
    }
  };

  const toggleConcluido = async (id: string): Promise<boolean> => {
    try {
      const updatedLembretes = lembretes.map(lembrete =>
        lembrete.id === id
          ? {
              ...lembrete,
              concluido: !lembrete.concluido,
              updatedAt: new Date().toISOString(),
            }
          : lembrete
      );
      setLembretes(updatedLembretes);
      saveToStorage(updatedLembretes);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar lembrete:', error);
      return false;
    }
  };

  const deleteLembrete = async (id: string): Promise<boolean> => {
    try {
      const updatedLembretes = lembretes.filter(lembrete => lembrete.id !== id);
      setLembretes(updatedLembretes);
      saveToStorage(updatedLembretes);
      return true;
    } catch (error) {
      console.error('Erro ao deletar lembrete:', error);
      return false;
    }
  };

  const getLembretesHoje = (): CrmLembrete[] => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    return lembretes.filter(lembrete => {
      const dataLembrete = new Date(lembrete.dataHora);
      return dataLembrete >= hoje && dataLembrete < amanha && !lembrete.concluido;
    });
  };

  const getLembretesProximos = (): CrmLembrete[] => {
    const agora = new Date();
    const seteDias = new Date(agora);
    seteDias.setDate(seteDias.getDate() + 7);

    return lembretes.filter(lembrete => {
      const dataLembrete = new Date(lembrete.dataHora);
      return dataLembrete >= agora && dataLembrete <= seteDias && !lembrete.concluido;
    }).sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
  };

  const getLembretesAtrasados = (): CrmLembrete[] => {
    const agora = new Date();
    return lembretes.filter(lembrete => {
      const dataLembrete = new Date(lembrete.dataHora);
      return dataLembrete < agora && !lembrete.concluido;
    });
  };

  return {
    lembretes,
    loading,
    createLembrete,
    updateLembrete,
    toggleConcluido,
    deleteLembrete,
    getLembretesHoje,
    getLembretesProximos,
    getLembretesAtrasados,
  };
}

type CrmLembreteData = Omit<CrmLembrete, 'id' | 'createdAt' | 'updatedAt'>;
