import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Truck,
  CheckCircle,
  AlertTriangle,
  Plus,
  Save
} from "lucide-react";
import { useAgregados, Agregado } from "@/hooks/useAgregados";
import { useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function FrotaAtual() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedAgregado, setSelectedAgregado] = useState<Agregado | null>(null);
  const [editingAgregado, setEditingAgregado] = useState<Agregado | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { agregados, loading, deleteAgregado, updateAgregado } = useAgregados();
  const navigate = useNavigate();

  const getAgregadoStatus = (agregado: Agregado): "ativo" | "inativo" | "pendente" => {
    if (!agregado.ativo) return "inativo";
    
    const hoje = new Date();
    const validadeCNH = new Date(agregado.validade_cnh);
    const validadeCRLV = agregado.data_crlv ? new Date(agregado.data_crlv) : null;
    
    // Se algum documento está vencido
    if (validadeCNH < hoje || (validadeCRLV && validadeCRLV < hoje)) {
      return "pendente";
    }
    
    return "ativo";
  };

  const getAgregadoAlertas = (agregado: Agregado): string[] => {
    const alertas: string[] = [];
    const hoje = new Date();
    const em30Dias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const validadeCNH = new Date(agregado.validade_cnh);
    const validadeCRLV = agregado.data_crlv ? new Date(agregado.data_crlv) : null;
    
    if (validadeCNH < hoje) {
      alertas.push("CNH vencida");
    } else if (validadeCNH <= em30Dias) {
      alertas.push("CNH vence em breve");
    }
    
    if (validadeCRLV) {
      if (validadeCRLV < hoje) {
        alertas.push("CRLV vencido");
      } else if (validadeCRLV <= em30Dias) {
        alertas.push("CRLV vence em breve");
      }
    }
    
    return alertas;
  };

  const agregadosComStatus = useMemo(() => {
    return agregados.map(agregado => ({
      ...agregado,
      status: getAgregadoStatus(agregado),
      alertas: getAgregadoAlertas(agregado)
    }));
  }, [agregados]);

  const filteredAgregados = agregadosComStatus.filter(agregado => {
    const matchesSearch = agregado.nome_motorista.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agregado.placa_veiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agregado.proprietario_veiculo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || agregado.tipo_veiculo === filterType;
    const matchesStatus = filterStatus === "all" || agregado.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    await deleteAgregado(id);
  };

  const handleView = (agregado: Agregado) => {
    setSelectedAgregado(agregado);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (agregado: Agregado) => {
    setEditingAgregado({ ...agregado });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingAgregado) return;

    const success = await updateAgregado(editingAgregado.id, {
      nome_motorista: editingAgregado.nome_motorista,
      contato_motorista: editingAgregado.contato_motorista,
      placa_veiculo: editingAgregado.placa_veiculo,
      tipo_veiculo: editingAgregado.tipo_veiculo,
      proprietario_veiculo: editingAgregado.proprietario_veiculo,
      contato_proprietario: editingAgregado.contato_proprietario,
      numero_cnh: editingAgregado.numero_cnh,
      categoria_cnh: editingAgregado.categoria_cnh,
      validade_cnh: editingAgregado.validade_cnh,
      numero_antt: editingAgregado.numero_antt,
      observacoes: editingAgregado.observacoes,
      ativo: editingAgregado.ativo
    });

    if (success) {
      setIsEditDialogOpen(false);
      setEditingAgregado(null);
    }
  };

  const updateEditingField = (field: keyof Agregado, value: any) => {
    if (!editingAgregado) return;
    setEditingAgregado(prev => prev ? { ...prev, [field]: value } : null);
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return <Badge className="bg-success text-success-foreground">Ativo</Badge>;
      case "inativo":
        return <Badge variant="destructive">Inativo</Badge>;
      case "pendente":
        return <Badge className="bg-warning text-warning-foreground">Pendente</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ativo":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "inativo":
        return <Truck className="w-4 h-4 text-muted-foreground" />;
      case "pendente":
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      default:
        return <Truck className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Truck className="w-8 h-8 text-primary" />
          Frota Atual
        </h1>
        <p className="text-muted-foreground">
          Gestão de agregados ativos na frota Giannone Transportes
        </p>
      </div>

      {/* Filtros e Busca */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros e Busca
            </div>
            <Button onClick={() => navigate('/cadastro')} className="bg-gradient-primary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Novo Agregado
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por motorista, placa ou proprietário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de veículo" />
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

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-gradient-primary hover:opacity-90">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Agregados */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Agregados Cadastrados ({filteredAgregados.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Carregando agregados...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAgregados.map((agregado) => (
                <div
                  key={agregado.id}
                  className="border border-border rounded-lg p-4 hover:shadow-card transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(agregado.status)}
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-foreground">{agregado.nome_motorista}</h3>
                          {getStatusBadge(agregado.status)}
                          {agregado.alertas.length > 0 && (
                            <Badge variant="outline" className="text-warning border-warning">
                              {agregado.alertas.length} alerta(s)
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Placa:</span> {agregado.placa_veiculo}
                          </div>
                          <div>
                            <span className="font-medium">Tipo:</span> {agregado.tipo_veiculo}
                          </div>
                          <div>
                            <span className="font-medium">Proprietário:</span> {agregado.proprietario_veiculo}
                          </div>
                          <div>
                            <span className="font-medium">Contato:</span> {agregado.contato_motorista || agregado.contato_proprietario || 'N/A'}
                          </div>
                        </div>
                        {agregado.alertas.length > 0 && (
                          <div className="mt-2">
                            {agregado.alertas.map((alerta, index) => (
                              <div key={index} className="text-sm text-warning flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                {alerta}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleView(agregado)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(agregado)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o agregado de {agregado.nome_motorista}? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(agregado.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredAgregados.length === 0 && (
            <div className="text-center py-8">
              <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {agregados.length === 0 
                  ? "Nenhum agregado cadastrado. Clique em 'Novo Agregado' para começar."
                  : "Nenhum agregado encontrado com os filtros aplicados."
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Visualização */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Agregado</DialogTitle>
          </DialogHeader>
          {selectedAgregado && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Dados do Motorista</h3>
                <div className="space-y-2">
                  <div><strong>Nome:</strong> {selectedAgregado.nome_motorista}</div>
                  <div><strong>Contato:</strong> {selectedAgregado.contato_motorista || 'N/A'}</div>
                  <div><strong>CNH:</strong> {selectedAgregado.numero_cnh}</div>
                  <div><strong>Categoria CNH:</strong> {selectedAgregado.categoria_cnh}</div>
                  <div><strong>Validade CNH:</strong> {new Date(selectedAgregado.validade_cnh).toLocaleDateString('pt-BR')}</div>
                  <div><strong>ANTT:</strong> {selectedAgregado.numero_antt || 'N/A'}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Dados do Veículo</h3>
                <div className="space-y-2">
                  <div><strong>Placa:</strong> {selectedAgregado.placa_veiculo}</div>
                  <div><strong>Tipo:</strong> {selectedAgregado.tipo_veiculo}</div>
                  <div><strong>Cor:</strong> {selectedAgregado.cor_veiculo || 'N/A'}</div>
                  <div><strong>Proprietário:</strong> {selectedAgregado.proprietario_veiculo}</div>
                  <div><strong>Contato Proprietário:</strong> {selectedAgregado.contato_proprietario || 'N/A'}</div>
                  <div><strong>Status:</strong> {selectedAgregado.ativo ? 'Ativo' : 'Inativo'}</div>
                </div>
              </div>
              
              {selectedAgregado.observacoes && (
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-lg mb-2">Observações</h3>
                  <p className="text-sm text-muted-foreground">{selectedAgregado.observacoes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Agregado</DialogTitle>
          </DialogHeader>
          {editingAgregado && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-nome">Nome do Motorista</Label>
                  <Input
                    id="edit-nome"
                    value={editingAgregado.nome_motorista}
                    onChange={(e) => updateEditingField('nome_motorista', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-contato">Contato do Motorista</Label>
                  <Input
                    id="edit-contato"
                    value={editingAgregado.contato_motorista || ''}
                    onChange={(e) => updateEditingField('contato_motorista', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-placa">Placa do Veículo</Label>
                  <Input
                    id="edit-placa"
                    value={editingAgregado.placa_veiculo}
                    onChange={(e) => updateEditingField('placa_veiculo', e.target.value.toUpperCase())}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-tipo">Tipo do Veículo</Label>
                  <Select 
                    value={editingAgregado.tipo_veiculo} 
                    onValueChange={(value) => updateEditingField('tipo_veiculo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3/4">3/4</SelectItem>
                      <SelectItem value="Toco">Toco</SelectItem>
                      <SelectItem value="Truck">Truck</SelectItem>
                      <SelectItem value="Carreta">Carreta</SelectItem>
                      <SelectItem value="Van">Van</SelectItem>
                      <SelectItem value="Bitrem">Bitrem</SelectItem>
                      <SelectItem value="Rodotrem">Rodotrem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="edit-proprietario">Proprietário do Veículo</Label>
                  <Input
                    id="edit-proprietario"
                    value={editingAgregado.proprietario_veiculo}
                    onChange={(e) => updateEditingField('proprietario_veiculo', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-contato-prop">Contato do Proprietário</Label>
                  <Input
                    id="edit-contato-prop"
                    value={editingAgregado.contato_proprietario || ''}
                    onChange={(e) => updateEditingField('contato_proprietario', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-cnh">Número da CNH</Label>
                  <Input
                    id="edit-cnh"
                    value={editingAgregado.numero_cnh}
                    onChange={(e) => updateEditingField('numero_cnh', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-categoria">Categoria CNH</Label>
                  <Select 
                    value={editingAgregado.categoria_cnh} 
                    onValueChange={(value) => updateEditingField('categoria_cnh', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="E">E</SelectItem>
                      <SelectItem value="AB">AB</SelectItem>
                      <SelectItem value="AC">AC</SelectItem>
                      <SelectItem value="AD">AD</SelectItem>
                      <SelectItem value="AE">AE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="edit-validade">Validade da CNH</Label>
                  <Input
                    id="edit-validade"
                    type="date"
                    value={editingAgregado.validade_cnh}
                    onChange={(e) => updateEditingField('validade_cnh', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-antt">Número ANTT</Label>
                  <Input
                    id="edit-antt"
                    value={editingAgregado.numero_antt || ''}
                    onChange={(e) => updateEditingField('numero_antt', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-ativo"
                  checked={editingAgregado.ativo || false}
                  onCheckedChange={(checked) => updateEditingField('ativo', checked)}
                />
                <Label htmlFor="edit-ativo">Agregado Ativo</Label>
              </div>
              
              <div>
                <Label htmlFor="edit-observacoes">Observações</Label>
                <Textarea
                  id="edit-observacoes"
                  value={editingAgregado.observacoes || ''}
                  onChange={(e) => updateEditingField('observacoes', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveEdit} className="bg-gradient-primary hover:opacity-90">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}