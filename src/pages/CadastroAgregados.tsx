import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Save, UserPlus } from "lucide-react";

export default function CadastroAgregados() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    dataInclusao: "",
    dataSaida: "",
    placa: "",
    tipoVeiculo: "",
    nomeMotorista: "",
    contatoMotorista: "",
    numeroCNH: "",
    categoriaCNH: "",
    validadeCNH: "",
    numeroANTT: "",
    proprietario: "",
    contatoProprietario: "",
    escolaridade: "",
    estadoCivil: "",
    corVeiculo: "",
    nomePai: "",
    restricoesRota: "",
    capacidadeCarga: "",
    portaLateral: false,
    quantidadePallets: "",
    pernoite: false,
    localPernoite: "",
    boaConduta: false,
    pontosCNH: "",
    dataDetizacao: "",
    dataVigilanciaSanitaria: "",
    dataCRLV: "",
    observacoes: ""
  });

  const tiposVeiculo = [
    "3/4",
    "Toco",
    "Truck",
    "Carreta",
    "Van",
    "Bitrem",
    "Rodotrem"
  ];

  const categoriasCNH = [
    "A",
    "B", 
    "C",
    "D",
    "E",
    "AB",
    "AC", 
    "AD",
    "AE"
  ];

  const escolaridades = [
    "Fundamental Incompleto",
    "Fundamental Completo",
    "Médio Incompleto",
    "Médio Completo",
    "Superior Incompleto",
    "Superior Completo",
    "Pós-graduação"
  ];

  const estadosCivis = [
    "Solteiro(a)",
    "Casado(a)",
    "Divorciado(a)",
    "Viúvo(a)",
    "União Estável"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.placa || !formData.nomeMotorista || !formData.tipoVeiculo) {
      toast({
        title: "Erro de validação",
        description: "Preencha os campos obrigatórios: Placa, Nome do Motorista e Tipo de Veículo",
        variant: "destructive"
      });
      return;
    }

    console.log("Dados do formulário:", formData);
    
    toast({
      title: "Agregado cadastrado com sucesso!",
      description: `Motorista ${formData.nomeMotorista} - Veículo ${formData.placa}`,
    });

    // Reset form
    setFormData({
      dataInclusao: "",
      dataSaida: "",
      placa: "",
      tipoVeiculo: "",
      nomeMotorista: "",
      contatoMotorista: "",
      numeroCNH: "",
      categoriaCNH: "",
      validadeCNH: "",
      numeroANTT: "",
      proprietario: "",
      contatoProprietario: "",
      escolaridade: "",
      estadoCivil: "",
      corVeiculo: "",
      nomePai: "",
      restricoesRota: "",
      capacidadeCarga: "",
      portaLateral: false,
      quantidadePallets: "",
      pernoite: false,
      localPernoite: "",
      boaConduta: false,
      pontosCNH: "",
      dataDetizacao: "",
      dataVigilanciaSanitaria: "",
      dataCRLV: "",
      observacoes: ""
    });
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <UserPlus className="w-8 h-8 text-primary" />
          Cadastro de Agregados
        </h1>
        <p className="text-muted-foreground">
          Cadastre novos agregados e veículos na frota Giannone Transportes
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados do Veículo */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Dados do Veículo</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="dataInclusao">Data de Inclusão</Label>
              <Input
                id="dataInclusao"
                type="date"
                value={formData.dataInclusao}
                onChange={(e) => updateFormData("dataInclusao", e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="placa">Placa do Veículo *</Label>
              <Input
                id="placa"
                placeholder="ABC-1234"
                value={formData.placa}
                onChange={(e) => updateFormData("placa", e.target.value.toUpperCase())}
                required
              />
            </div>

            <div>
              <Label htmlFor="tipoVeiculo">Tipo do Veículo *</Label>
              <Select value={formData.tipoVeiculo} onValueChange={(value) => updateFormData("tipoVeiculo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposVeiculo.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="corVeiculo">Cor do Veículo</Label>
              <Input
                id="corVeiculo"
                placeholder="Branco"
                value={formData.corVeiculo}
                onChange={(e) => updateFormData("corVeiculo", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="capacidadeCarga">Capacidade de Carga</Label>
              <Input
                id="capacidadeCarga"
                placeholder="Ex: 15 toneladas"
                value={formData.capacidadeCarga}
                onChange={(e) => updateFormData("capacidadeCarga", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="quantidadePallets">Quantidade de Pallets</Label>
              <Input
                id="quantidadePallets"
                type="number"
                placeholder="Ex: 24"
                value={formData.quantidadePallets}
                onChange={(e) => updateFormData("quantidadePallets", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dados do Motorista */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Dados do Motorista</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="nomeMotorista">Nome do Motorista *</Label>
              <Input
                id="nomeMotorista"
                placeholder="Nome completo"
                value={formData.nomeMotorista}
                onChange={(e) => updateFormData("nomeMotorista", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="contatoMotorista">Contato do Motorista</Label>
              <Input
                id="contatoMotorista"
                placeholder="(11) 99999-9999"
                value={formData.contatoMotorista}
                onChange={(e) => updateFormData("contatoMotorista", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="numeroCNH">Número da CNH</Label>
              <Input
                id="numeroCNH"
                placeholder="12345678901"
                value={formData.numeroCNH}
                onChange={(e) => updateFormData("numeroCNH", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="categoriaCNH">Categoria da CNH</Label>
              <Select value={formData.categoriaCNH} onValueChange={(value) => updateFormData("categoriaCNH", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categoriasCNH.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="validadeCNH">Validade da CNH</Label>
              <Input
                id="validadeCNH"
                type="date"
                value={formData.validadeCNH}
                onChange={(e) => updateFormData("validadeCNH", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="pontosCNH">Pontos na CNH</Label>
              <Input
                id="pontosCNH"
                type="number"
                placeholder="0"
                value={formData.pontosCNH}
                onChange={(e) => updateFormData("pontosCNH", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="escolaridade">Escolaridade</Label>
              <Select value={formData.escolaridade} onValueChange={(value) => updateFormData("escolaridade", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a escolaridade" />
                </SelectTrigger>
                <SelectContent>
                  {escolaridades.map((escolaridade) => (
                    <SelectItem key={escolaridade} value={escolaridade}>{escolaridade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="estadoCivil">Estado Civil</Label>
              <Select value={formData.estadoCivil} onValueChange={(value) => updateFormData("estadoCivil", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado civil" />
                </SelectTrigger>
                <SelectContent>
                  {estadosCivis.map((estado) => (
                    <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="nomePai">Nome do Pai (opcional)</Label>
              <Input
                id="nomePai"
                placeholder="Nome do pai"
                value={formData.nomePai}
                onChange={(e) => updateFormData("nomePai", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dados do Proprietário */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Dados do Proprietário</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="proprietario">Nome do Proprietário</Label>
              <Input
                id="proprietario"
                placeholder="Nome completo"
                value={formData.proprietario}
                onChange={(e) => updateFormData("proprietario", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="contatoProprietario">Contato do Proprietário</Label>
              <Input
                id="contatoProprietario"
                placeholder="(11) 99999-9999"
                value={formData.contatoProprietario}
                onChange={(e) => updateFormData("contatoProprietario", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Documentos e Datas */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Documentos e Certificações</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="numeroANTT">Número ANTT</Label>
              <Input
                id="numeroANTT"
                placeholder="123456789"
                value={formData.numeroANTT}
                onChange={(e) => updateFormData("numeroANTT", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="dataDetizacao">Data da Detetização</Label>
              <Input
                id="dataDetizacao"
                type="date"
                value={formData.dataDetizacao}
                onChange={(e) => updateFormData("dataDetizacao", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="dataVigilanciaSanitaria">Data da Vigilância Sanitária</Label>
              <Input
                id="dataVigilanciaSanitaria"
                type="date"
                value={formData.dataVigilanciaSanitaria}
                onChange={(e) => updateFormData("dataVigilanciaSanitaria", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="dataCRLV">Data do CRLV</Label>
              <Input
                id="dataCRLV"
                type="date"
                value={formData.dataCRLV}
                onChange={(e) => updateFormData("dataCRLV", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Informações Operacionais */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Informações Operacionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="restricoesRota">Restrições de Rota</Label>
                <Textarea
                  id="restricoesRota"
                  placeholder="Descreva as restrições de rota, se houver"
                  value={formData.restricoesRota}
                  onChange={(e) => updateFormData("restricoesRota", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="localPernoite">Local de Pernoite</Label>
                <Input
                  id="localPernoite"
                  placeholder="Local onde o motorista pernoita"
                  value={formData.localPernoite}
                  onChange={(e) => updateFormData("localPernoite", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="portaLateral"
                  checked={formData.portaLateral}
                  onCheckedChange={(checked) => updateFormData("portaLateral", checked)}
                />
                <Label htmlFor="portaLateral">Possui Porta Lateral</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="pernoite"
                  checked={formData.pernoite}
                  onCheckedChange={(checked) => updateFormData("pernoite", checked)}
                />
                <Label htmlFor="pernoite">Faz Pernoite</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="boaConduta"
                  checked={formData.boaConduta}
                  onCheckedChange={(checked) => updateFormData("boaConduta", checked)}
                />
                <Label htmlFor="boaConduta">Boa Conduta</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações Gerais</Label>
              <Textarea
                id="observacoes"
                placeholder="Informações adicionais sobre o agregado"
                value={formData.observacoes}
                onChange={(e) => updateFormData("observacoes", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-gradient-primary hover:opacity-90">
            <Save className="w-4 h-4 mr-2" />
            Salvar Agregado
          </Button>
        </div>
      </form>
    </div>
  );
}