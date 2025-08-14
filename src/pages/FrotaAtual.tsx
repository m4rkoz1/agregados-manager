import { useState } from "react";
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
  AlertTriangle
} from "lucide-react";

interface Agregado {
  id: number;
  placa: string;
  motorista: string;
  tipo: string;
  proprietario: string;
  contato: string;
  validadeCNH: string;
  validadeCRLV: string;
  status: "ativo" | "inativo" | "pendente";
  alertas: string[];
}

export default function FrotaAtual() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Dados mock para demonstração
  const agregados: Agregado[] = [
    {
      id: 1,
      placa: "ABC-1234",
      motorista: "João Silva",
      tipo: "Carreta",
      proprietario: "João Silva",
      contato: "(11) 99999-9999",
      validadeCNH: "2025-03-15",
      validadeCRLV: "2024-12-30",
      status: "ativo",
      alertas: []
    },
    {
      id: 2,
      placa: "XYZ-5678",
      motorista: "Maria Santos",
      tipo: "Truck",
      proprietario: "Transportes ABC",
      contato: "(11) 88888-8888",
      validadeCNH: "2024-08-30",
      validadeCRLV: "2025-01-15",
      status: "ativo",
      alertas: ["CNH vence em breve"]
    },
    {
      id: 3,
      placa: "DEF-9012",
      motorista: "Carlos Oliveira",
      tipo: "Toco",
      proprietario: "Carlos Oliveira",
      contato: "(11) 77777-7777",
      validadeCNH: "2025-06-20",
      validadeCRLV: "2024-08-10",
      status: "inativo",
      alertas: ["CRLV vencido"]
    },
    {
      id: 4,
      placa: "GHI-3456",
      motorista: "Ana Costa",
      tipo: "Van",
      proprietario: "Ana Costa",
      contato: "(11) 66666-6666",
      validadeCNH: "2025-02-10",
      validadeCRLV: "2025-04-25",
      status: "ativo",
      alertas: []
    },
    {
      id: 5,
      placa: "JKL-7890",
      motorista: "Pedro Lima",
      tipo: "3/4",
      proprietario: "Frota União",
      contato: "(11) 55555-5555",
      validadeCNH: "2024-09-05",
      validadeCRLV: "2024-11-20",
      status: "pendente",
      alertas: ["Documentação pendente"]
    }
  ];

  const filteredAgregados = agregados.filter(agregado => {
    const matchesSearch = agregado.motorista.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agregado.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agregado.proprietario.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || agregado.tipo === filterType;
    const matchesStatus = filterStatus === "all" || agregado.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

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
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros e Busca
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
                        <h3 className="font-semibold text-foreground">{agregado.motorista}</h3>
                        {getStatusBadge(agregado.status)}
                        {agregado.alertas.length > 0 && (
                          <Badge variant="outline" className="text-warning border-warning">
                            {agregado.alertas.length} alerta(s)
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Placa:</span> {agregado.placa}
                        </div>
                        <div>
                          <span className="font-medium">Tipo:</span> {agregado.tipo}
                        </div>
                        <div>
                          <span className="font-medium">Proprietário:</span> {agregado.proprietario}
                        </div>
                        <div>
                          <span className="font-medium">Contato:</span> {agregado.contato}
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
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAgregados.length === 0 && (
            <div className="text-center py-8">
              <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum agregado encontrado com os filtros aplicados.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}