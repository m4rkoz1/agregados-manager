import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Download, FileSpreadsheet, Filter } from "lucide-react";
import { useAgregados } from "@/hooks/useAgregados";
import * as XLSX from 'xlsx';

export default function Relatorios() {
  const { toast } = useToast();
  const { agregados, loading } = useAgregados();
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'nome_motorista',
    'placa_veiculo',
    'tipo_veiculo',
    'proprietario_veiculo'
  ]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const availableFields = [
    { key: 'nome_motorista', label: 'Nome do Motorista' },
    { key: 'placa_veiculo', label: 'Placa do Veículo' },
    { key: 'tipo_veiculo', label: 'Tipo do Veículo' },
    { key: 'proprietario_veiculo', label: 'Proprietário do Veículo' },
    { key: 'contato_motorista', label: 'Contato do Motorista' },
    { key: 'contato_proprietario', label: 'Contato do Proprietário' },
    { key: 'numero_cnh', label: 'Número da CNH' },
    { key: 'categoria_cnh', label: 'Categoria da CNH' },
    { key: 'validade_cnh', label: 'Validade da CNH' },
    { key: 'numero_antt', label: 'Número ANTT' },
    { key: 'data_inclusao', label: 'Data de Inclusão' },
    { key: 'data_saida', label: 'Data de Saída' },
    { key: 'cor_veiculo', label: 'Cor do Veículo' },
    { key: 'capacidade_carga_toneladas', label: 'Capacidade de Carga (ton)' },
    { key: 'capacidade_carga_m3', label: 'Capacidade de Carga (m³)' },
    { key: 'porta_lateral', label: 'Porta Lateral' },
    { key: 'quantidade_pallets', label: 'Quantidade de Pallets' },
    { key: 'pernoite', label: 'Pernoite' },
    { key: 'local_pernoite', label: 'Local de Pernoite' },
    { key: 'boa_conduta', label: 'Boa Conduta' },
    { key: 'pontos_cnh', label: 'Pontos na CNH' },
    { key: 'escolaridade', label: 'Escolaridade do Motorista' },
    { key: 'estado_civil', label: 'Estado Civil do Motorista' },
    { key: 'nome_pai', label: 'Nome do Pai do Motorista' },
    { key: 'cpf_proprietario', label: 'CPF do Proprietário' },
    { key: 'rg_proprietario', label: 'RG do Proprietário' },
    { key: 'endereco_proprietario', label: 'Endereço do Proprietário' },
    { key: 'escolaridade_proprietario', label: 'Escolaridade do Proprietário' },
    { key: 'estado_civil_proprietario', label: 'Estado Civil do Proprietário' },
    { key: 'nome_pai_proprietario', label: 'Nome do Pai do Proprietário' },
    { key: 'data_detizacao', label: 'Data da Detetização' },
    { key: 'data_vigilancia_sanitaria', label: 'Data da Vigilância Sanitária' },
    { key: 'data_crlv', label: 'Data do CRLV' },
    { key: 'restricoes_rota', label: 'Restrições de Rota' },
    { key: 'observacoes', label: 'Observações' },
    { key: 'ativo', label: 'Status (Ativo/Inativo)' },
    { key: 'created_at', label: 'Data de Criação' },
    { key: 'updated_at', label: 'Última Atualização' }
  ];

  const getAgregadoStatus = (agregado: any): "ativo" | "inativo" | "pendente" => {
    if (!agregado.ativo) return "inativo";
    
    const hoje = new Date();
    const validadeCNH = new Date(agregado.validade_cnh);
    const validadeCRLV = agregado.data_crlv ? new Date(agregado.data_crlv) : null;
    
    if (validadeCNH < hoje || (validadeCRLV && validadeCRLV < hoje)) {
      return "pendente";
    }
    
    return "ativo";
  };

  const filteredAgregados = agregados.filter(agregado => {
    const status = getAgregadoStatus(agregado);
    const matchesStatus = filterStatus === "all" || status === filterStatus;
    const matchesType = filterType === "all" || agregado.tipo_veiculo === filterType;
    
    return matchesStatus && matchesType;
  });

  const handleFieldChange = (fieldKey: string, checked: boolean) => {
    if (checked) {
      setSelectedFields(prev => [...prev, fieldKey]);
    } else {
      setSelectedFields(prev => prev.filter(field => field !== fieldKey));
    }
  };

  const formatValue = (value: any, fieldKey: string): string => {
    if (value === null || value === undefined) return '';
    
    if (fieldKey.includes('data_') && value) {
      return new Date(value).toLocaleDateString('pt-BR');
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Sim' : 'Não';
    }
    
    if (fieldKey === 'ativo') {
      return value ? 'Ativo' : 'Inativo';
    }
    
    return value.toString();
  };

  const exportToExcel = () => {
    if (selectedFields.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um campo para exportar",
        variant: "destructive"
      });
      return;
    }

    try {
      // Preparar dados para exportação
      const exportData = filteredAgregados.map(agregado => {
        const row: any = {};
        selectedFields.forEach(field => {
          const fieldLabel = availableFields.find(f => f.key === field)?.label || field;
          row[fieldLabel] = formatValue(agregado[field as keyof typeof agregado], field);
        });
        return row;
      });

      // Criar workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Configurar larguras das colunas
      const colWidths = selectedFields.map(() => ({ wch: 20 }));
      ws['!cols'] = colWidths;

      // Adicionar worksheet ao workbook
      XLSX.utils.book_append_sheet(wb, ws, "Agregados");

      // Gerar nome do arquivo com data/hora
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `agregados_${timestamp}.xlsx`;

      // Fazer download
      XLSX.writeFile(wb, filename);

      toast({
        title: "Exportação realizada com sucesso!",
        description: `Arquivo ${filename} foi baixado com ${exportData.length} registros.`
      });
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast({
        title: "Erro ao exportar",
        description: "Não foi possível gerar o arquivo Excel.",
        variant: "destructive"
      });
    }
  };

  const selectAllFields = () => {
    setSelectedFields(availableFields.map(field => field.key));
  };

  const clearAllFields = () => {
    setSelectedFields([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <FileSpreadsheet className="w-8 h-8 text-primary" />
          Relatórios
        </h1>
        <p className="text-muted-foreground">
          Gere relatórios personalizados dos agregados cadastrados
        </p>
      </div>

      {/* Filtros */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="filterStatus">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="filterType">Tipo de Veículo</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="Carreta">Carreta</SelectItem>
                  <SelectItem value="Truck">Truck</SelectItem>
                  <SelectItem value="Toco">Toco</SelectItem>
                  <SelectItem value="Van">Van</SelectItem>
                  <SelectItem value="3/4">3/4</SelectItem>
                  <SelectItem value="Bitrem">Bitrem</SelectItem>
                  <SelectItem value="Rodotrem">Rodotrem</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seleção de Campos */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Campos para Exportação</span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={selectAllFields}
              >
                Selecionar Todos
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllFields}
              >
                Limpar Seleção
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableFields.map((field) => (
              <div key={field.key} className="flex items-center space-x-2">
                <Checkbox
                  id={field.key}
                  checked={selectedFields.includes(field.key)}
                  onCheckedChange={(checked) => handleFieldChange(field.key, checked as boolean)}
                />
                <Label 
                  htmlFor={field.key}
                  className="text-sm font-normal cursor-pointer"
                >
                  {field.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumo e Exportação */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Resumo do Relatório</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary">{filteredAgregados.length}</div>
              <div className="text-sm text-muted-foreground">Registros Selecionados</div>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary">{selectedFields.length}</div>
              <div className="text-sm text-muted-foreground">Campos Selecionados</div>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary">Excel</div>
              <div className="text-sm text-muted-foreground">Formato de Exportação</div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button 
              onClick={exportToExcel}
              disabled={loading || selectedFields.length === 0}
              className="bg-gradient-primary hover:opacity-90"
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              {loading ? "Carregando..." : "Exportar para Excel"}
            </Button>
          </div>

          {selectedFields.length === 0 && (
            <p className="text-center text-muted-foreground text-sm">
              Selecione pelo menos um campo para habilitar a exportação
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}