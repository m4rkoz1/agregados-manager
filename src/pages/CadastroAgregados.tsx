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
import { useAgregados, CreateAgregadoData } from "@/hooks/useAgregados";
import { useNavigate } from "react-router-dom";

export default function CadastroAgregados() {
  const { toast } = useToast();
  const { createAgregado } = useAgregados();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    cpfProprietario: "",
    rgProprietario: "",
    enderecoProprietario: "",
    escolaridadeProprietario: "",
    estadoCivilProprietario: "",
    nomePaiProprietario: "",
    pisProprietario: "",
    ressalvaProprietario: "",
    nomeReferenciaProprietario: "",
    contatoReferenciaProprietario: "",
    ressalvaMotorista: "",
    nomeReferenciaMotorista: "",
    contatoReferenciaMotorista: "",
    corVeiculo: "",
    restricoesRota: "",
    quantidadePaleteOperacional: "",
    capacidadeCargaOperacional: "",
    pernoite: false,
    boaConduta: false,
    viagem: false,
    rastreador: false,
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
    "Rodotrem",
    "Bongo",
    "Cargovan",
    "Fiorino"
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.placa || !formData.nomeMotorista || !formData.tipoVeiculo || !formData.numeroCNH) {
      toast({
        title: "Erro de validação",
        description: "Preencha os campos obrigatórios: Placa, Nome do Motorista, Tipo de Veículo e CNH",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const agregadoData: CreateAgregadoData = {
        data_inclusao: formData.dataInclusao || new Date().toISOString().split('T')[0],
        data_saida: formData.dataSaida || undefined,
        placa_veiculo: formData.placa.toUpperCase(),
        tipo_veiculo: formData.tipoVeiculo,
        nome_motorista: formData.nomeMotorista,
        contato_motorista: formData.contatoMotorista || undefined,
        numero_cnh: formData.numeroCNH,
        categoria_cnh: formData.categoriaCNH,
        validade_cnh: formData.validadeCNH,
        numero_antt: formData.numeroANTT || undefined,
        proprietario_veiculo: formData.proprietario,
        contato_proprietario: formData.contatoProprietario || undefined,
        cpf_proprietario: formData.cpfProprietario || undefined,
        rg_proprietario: formData.rgProprietario || undefined,
        endereco_proprietario: formData.enderecoProprietario || undefined,
        escolaridade_proprietario: formData.escolaridadeProprietario || undefined,
        estado_civil_proprietario: formData.estadoCivilProprietario || undefined,
        nome_pai_proprietario: formData.nomePaiProprietario || undefined,
        pis_proprietario: formData.pisProprietario || undefined,
        ressalva_proprietario: formData.ressalvaProprietario || undefined,
        nome_referencia_proprietario: formData.nomeReferenciaProprietario || undefined,
        contato_referencia_proprietario: formData.contatoReferenciaProprietario || undefined,
        ressalva_motorista: formData.ressalvaMotorista || undefined,
        nome_referencia_motorista: formData.nomeReferenciaMotorista || undefined,
        contato_referencia_motorista: formData.contatoReferenciaMotorista || undefined,
        cor_veiculo: formData.corVeiculo || undefined,
        restricoes_rota: formData.restricoesRota || undefined,
        quantidade_palete_operacional: formData.quantidadePaleteOperacional ? parseInt(formData.quantidadePaleteOperacional) : undefined,
        capacidade_carga_operacional: formData.capacidadeCargaOperacional ? parseFloat(formData.capacidadeCargaOperacional) : undefined,
        pernoite: formData.pernoite,
        boa_conduta: formData.boaConduta,
        viagem: formData.viagem,
        rastreador: formData.rastreador,
        data_detizacao: formData.dataDetizacao || undefined,
        data_vigilancia_sanitaria: formData.dataVigilanciaSanitaria || undefined,
        data_crlv: formData.dataCRLV || undefined,
        observacoes: formData.observacoes || undefined,
        ativo: true
      };

      const success = await createAgregado(agregadoData);
      
      if (success) {
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
          cpfProprietario: "",
          rgProprietario: "",
          enderecoProprietario: "",
          escolaridadeProprietario: "",
          estadoCivilProprietario: "",
          nomePaiProprietario: "",
          pisProprietario: "",
          ressalvaProprietario: "",
          nomeReferenciaProprietario: "",
          contatoReferenciaProprietario: "",
          ressalvaMotorista: "",
          nomeReferenciaMotorista: "",
          contatoReferenciaMotorista: "",
          corVeiculo: "",
          restricoesRota: "",
          quantidadePaleteOperacional: "",
          capacidadeCargaOperacional: "",
          pernoite: false,
          boaConduta: false,
          viagem: false,
          rastreador: false,
          dataDetizacao: "",
          dataVigilanciaSanitaria: "",
          dataCRLV: "",
          observacoes: ""
        });
        
        // Redirecionar para a lista de frota
        setTimeout(() => navigate('/frota'), 1500);
      }
    } finally {
      setIsSubmitting(false);
    }
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
              <Label htmlFor="nomeReferenciaMotorista">Nome de Referência</Label>
              <Input
                id="nomeReferenciaMotorista"
                placeholder="Nome da referência"
                value={formData.nomeReferenciaMotorista}
                onChange={(e) => updateFormData("nomeReferenciaMotorista", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="contatoReferenciaMotorista">Contato de Referência</Label>
              <Input
                id="contatoReferenciaMotorista"
                placeholder="(11) 99999-9999"
                value={formData.contatoReferenciaMotorista}
                onChange={(e) => updateFormData("contatoReferenciaMotorista", e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="ressalvaMotorista">Ressalva (Histórico Motorista)</Label>
              <Textarea
                id="ressalvaMotorista"
                placeholder="Informações sobre o histórico do motorista"
                value={formData.ressalvaMotorista}
                onChange={(e) => updateFormData("ressalvaMotorista", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dados do Proprietário */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Dados do Proprietário</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

            <div>
              <Label htmlFor="cpfProprietario">CPF do Proprietário</Label>
              <Input
                id="cpfProprietario"
                placeholder="000.000.000-00"
                value={formData.cpfProprietario}
                onChange={(e) => updateFormData("cpfProprietario", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="rgProprietario">RG do Proprietário</Label>
              <Input
                id="rgProprietario"
                placeholder="00.000.000-0"
                value={formData.rgProprietario}
                onChange={(e) => updateFormData("rgProprietario", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="pisProprietario">PIS do Proprietário</Label>
              <Input
                id="pisProprietario"
                placeholder="000.00000.00-0"
                value={formData.pisProprietario}
                onChange={(e) => updateFormData("pisProprietario", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="escolaridadeProprietario">Escolaridade do Proprietário</Label>
              <Select value={formData.escolaridadeProprietario} onValueChange={(value) => updateFormData("escolaridadeProprietario", value)}>
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
              <Label htmlFor="estadoCivilProprietario">Estado Civil do Proprietário</Label>
              <Select value={formData.estadoCivilProprietario} onValueChange={(value) => updateFormData("estadoCivilProprietario", value)}>
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
              <Label htmlFor="nomePaiProprietario">Nome do Pai do Proprietário</Label>
              <Input
                id="nomePaiProprietario"
                placeholder="Nome do pai"
                value={formData.nomePaiProprietario}
                onChange={(e) => updateFormData("nomePaiProprietario", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="nomeReferenciaProprietario">Nome de Referência</Label>
              <Input
                id="nomeReferenciaProprietario"
                placeholder="Nome da referência"
                value={formData.nomeReferenciaProprietario}
                onChange={(e) => updateFormData("nomeReferenciaProprietario", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="contatoReferenciaProprietario">Contato de Referência</Label>
              <Input
                id="contatoReferenciaProprietario"
                placeholder="(11) 99999-9999"
                value={formData.contatoReferenciaProprietario}
                onChange={(e) => updateFormData("contatoReferenciaProprietario", e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="enderecoProprietario">Endereço do Proprietário</Label>
              <Textarea
                id="enderecoProprietario"
                placeholder="Endereço completo"
                value={formData.enderecoProprietario}
                onChange={(e) => updateFormData("enderecoProprietario", e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="ressalvaProprietario">Ressalva (Histórico Proprietário)</Label>
              <Textarea
                id="ressalvaProprietario"
                placeholder="Informações sobre o histórico do proprietário"
                value={formData.ressalvaProprietario}
                onChange={(e) => updateFormData("ressalvaProprietario", e.target.value)}
                rows={3}
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
                <Label htmlFor="quantidadePaleteOperacional">Quantidade de Palete</Label>
                <Input
                  id="quantidadePaleteOperacional"
                  type="number"
                  placeholder="Ex: 24"
                  value={formData.quantidadePaleteOperacional}
                  onChange={(e) => updateFormData("quantidadePaleteOperacional", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="capacidadeCargaOperacional">Capacidade de Carga</Label>
                <Input
                  id="capacidadeCargaOperacional"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 15.5"
                  value={formData.capacidadeCargaOperacional}
                  onChange={(e) => updateFormData("capacidadeCargaOperacional", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="restricoesRota">Restrições de Rota</Label>
              <Textarea
                id="restricoesRota"
                placeholder="Descreva as restrições de rota, se houver"
                value={formData.restricoesRota}
                onChange={(e) => updateFormData("restricoesRota", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="viagem"
                  checked={formData.viagem}
                  onCheckedChange={(checked) => updateFormData("viagem", checked)}
                />
                <Label htmlFor="viagem">Viagem</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="rastreador"
                  checked={formData.rastreador}
                  onCheckedChange={(checked) => updateFormData("rastreador", checked)}
                />
                <Label htmlFor="rastreador">Rastreador</Label>
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
          <Button type="button" variant="outline" onClick={() => navigate('/frota')} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-gradient-primary hover:opacity-90" disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Salvando...' : 'Salvar Agregado'}
          </Button>
        </div>
      </form>
    </div>
  );
}