import { useState, useEffect } from 'react';

export interface CrmLead {
  id: string;
  nome: string;
  contato: string;
  email?: string;
  tipoVeiculo?: string;
  status: 'novo' | 'em_contato' | 'qualificado' | 'perdido' | 'convertido';
  origem?: string;
  observacoes?: string;
  dataInclusao: string;
  ultimoContato?: string;
  proximoContato?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCrmLeadData {
  nome: string;
  contato: string;
  email?: string;
  tipoVeiculo?: string;
  status?: 'novo' | 'em_contato' | 'qualificado' | 'perdido' | 'convertido';
  origem?: string;
  observacoes?: string;
  proximoContato?: string;
}

const STORAGE_KEY = 'crm_leads';

export function useCrmLeads() {
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
    }
    return [];
  };

  const saveToStorage = (data: CrmLead[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar leads:', error);
    }
  };

  useEffect(() => {
    const loadedLeads = loadFromStorage();
    setLeads(loadedLeads);
    setLoading(false);
  }, []);

  const createLead = async (data: CreateCrmLeadData): Promise<boolean> => {
    try {
      const newLead: CrmLead = {
        id: crypto.randomUUID(),
        nome: data.nome,
        contato: data.contato,
        email: data.email,
        tipoVeiculo: data.tipoVeiculo,
        status: data.status || 'novo',
        origem: data.origem,
        observacoes: data.observacoes,
        dataInclusao: new Date().toISOString(),
        proximoContato: data.proximoContato,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedLeads = [...leads, newLead];
      setLeads(updatedLeads);
      saveToStorage(updatedLeads);
      return true;
    } catch (error) {
      console.error('Erro ao criar lead:', error);
      return false;
    }
  };

  const updateLead = async (id: string, data: Partial<CreateCrmLeadData>): Promise<boolean> => {
    try {
      const updatedLeads = leads.map(lead =>
        lead.id === id
          ? {
              ...lead,
              ...data,
              updatedAt: new Date().toISOString(),
              ultimoContato: new Date().toISOString(),
            }
          : lead
      );
      setLeads(updatedLeads);
      saveToStorage(updatedLeads);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
      return false;
    }
  };

  const deleteLead = async (id: string): Promise<boolean> => {
    try {
      const updatedLeads = leads.filter(lead => lead.id !== id);
      setLeads(updatedLeads);
      saveToStorage(updatedLeads);
      return true;
    } catch (error) {
      console.error('Erro ao deletar lead:', error);
      return false;
    }
  };

  const getLeadById = (id: string): CrmLead | undefined => {
    return leads.find(lead => lead.id === id);
  };

  const getLeadsByStatus = (status: CrmLead['status']): CrmLead[] => {
    return leads.filter(lead => lead.status === status);
  };

  const getLeadsComProximoContato = (): CrmLead[] => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    return leads.filter(lead => {
      if (!lead.proximoContato) return false;
      const dataContato = new Date(lead.proximoContato);
      dataContato.setHours(0, 0, 0, 0);
      return dataContato <= hoje && lead.status !== 'convertido' && lead.status !== 'perdido';
    });
  };

  return {
    leads,
    loading,
    createLead,
    updateLead,
    deleteLead,
    getLeadById,
    getLeadsByStatus,
    getLeadsComProximoContato,
  };
}
