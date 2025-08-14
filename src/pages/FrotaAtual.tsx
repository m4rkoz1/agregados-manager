import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
  Plus
} from "lucide-react";
import { useAgregados, Agregado } from "@/hooks/useAgregados";
import { useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function FrotaAtual() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const { agregados, loading, deleteAgregado } = useAgregados();
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
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
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
    </div>
  );
}