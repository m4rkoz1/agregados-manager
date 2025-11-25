import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useCrmLeads, CreateCrmLeadData, CrmLead } from "@/hooks/useCrmLeads";
import { useCrmLembretes, CreateCrmLembreteData } from "@/hooks/useCrmLembretes";
import { UserPlus, Calendar, Phone, Mail, Trash2, Edit, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";

const statusColors = {
  novo: "bg-blue-500",
  em_contato: "bg-yellow-500",
  qualificado: "bg-green-500",
  perdido: "bg-red-500",
  convertido: "bg-purple-500",
};

const statusLabels = {
  novo: "Novo",
  em_contato: "Em Contato",
  qualificado: "Qualificado",
  perdido: "Perdido",
  convertido: "Convertido",
};

const tipoLembreteLabels = {
  ligacao: "Ligação",
  reuniao: "Reunião",
  email: "E-mail",
  visita: "Visita",
  outro: "Outro",
};

export default function CRM() {
  const { toast } = useToast();
  const { leads, createLead, updateLead, deleteLead, getLeadsComProximoContato } = useCrmLeads();
  const { lembretes, createLembrete, toggleConcluido, deleteLembrete, getLembretesProximos, getLembretesAtrasados } = useCrmLembretes();

  const [openLeadDialog, setOpenLeadDialog] = useState(false);
  const [openLembreteDialog, setOpenLembreteDialog] = useState(false);
  const [editingLead, setEditingLead] = useState<CrmLead | null>(null);

  const [leadForm, setLeadForm] = useState<CreateCrmLeadData>({
    nome: "",
    contato: "",
    email: "",
    tipoVeiculo: "",
    status: "novo",
    origem: "",
    observacoes: "",
    proximoContato: "",
  });

  const [lembreteForm, setLembreteForm] = useState<CreateCrmLembreteData>({
    titulo: "",
    descricao: "",
    dataHora: "",
    tipo: "ligacao",
  });

  const handleCreateLead = async () => {
    if (!leadForm.nome || !leadForm.contato) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome e contato",
        variant: "destructive",
      });
      return;
    }

    const success = editingLead
      ? await updateLead(editingLead.id, leadForm)
      : await createLead(leadForm);

    if (success) {
      toast({
        title: editingLead ? "Lead atualizado!" : "Lead criado!",
        description: editingLead ? "Lead atualizado com sucesso." : "Novo lead adicionado ao CRM.",
      });
      setOpenLeadDialog(false);
      setEditingLead(null);
      setLeadForm({
        nome: "",
        contato: "",
        email: "",
        tipoVeiculo: "",
        status: "novo",
        origem: "",
        observacoes: "",
        proximoContato: "",
      });
    }
  };

  const handleCreateLembrete = async () => {
    if (!lembreteForm.titulo || !lembreteForm.dataHora) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha título e data/hora",
        variant: "destructive",
      });
      return;
    }

    const success = await createLembrete(lembreteForm);

    if (success) {
      toast({
        title: "Lembrete criado!",
        description: "Lembrete adicionado à agenda.",
      });
      setOpenLembreteDialog(false);
      setLembreteForm({
        titulo: "",
        descricao: "",
        dataHora: "",
        tipo: "ligacao",
      });
    }
  };

  const handleEditLead = (lead: CrmLead) => {
    setEditingLead(lead);
    setLeadForm({
      nome: lead.nome,
      contato: lead.contato,
      email: lead.email,
      tipoVeiculo: lead.tipoVeiculo,
      status: lead.status,
      origem: lead.origem,
      observacoes: lead.observacoes,
      proximoContato: lead.proximoContato,
    });
    setOpenLeadDialog(true);
  };

  const leadsComContato = getLeadsComProximoContato();
  const lembretesProximos = getLembretesProximos();
  const lembretesAtrasados = getLembretesAtrasados();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">CRM - Captação de Agregados</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie leads e acompanhe contatos com potenciais agregados
        </p>
      </div>

      {/* Alertas */}
      {(leadsComContato.length > 0 || lembretesAtrasados.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {leadsComContato.length > 0 && (
            <Card className="border-yellow-500/50 bg-yellow-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  Contatos Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{leadsComContato.length}</p>
                <p className="text-xs text-muted-foreground">leads precisam de contato</p>
              </CardContent>
            </Card>
          )}
          
          {lembretesAtrasados.length > 0 && (
            <Card className="border-red-500/50 bg-red-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-red-500" />
                  Lembretes Atrasados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{lembretesAtrasados.length}</p>
                <p className="text-xs text-muted-foreground">lembretes pendentes</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="agenda">Agenda & Lembretes</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Badge variant="outline">Total: {leads.length}</Badge>
              <Badge className="bg-blue-500">Novos: {leads.filter(l => l.status === 'novo').length}</Badge>
              <Badge className="bg-green-500">Qualificados: {leads.filter(l => l.status === 'qualificado').length}</Badge>
            </div>

            <Dialog open={openLeadDialog} onOpenChange={setOpenLeadDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingLead(null);
                  setLeadForm({
                    nome: "",
                    contato: "",
                    email: "",
                    tipoVeiculo: "",
                    status: "novo",
                    origem: "",
                    observacoes: "",
                    proximoContato: "",
                  });
                }}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Novo Lead
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingLead ? "Editar Lead" : "Novo Lead"}</DialogTitle>
                  <DialogDescription>
                    Cadastre informações do potencial agregado
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome *</Label>
                      <Input
                        id="nome"
                        value={leadForm.nome}
                        onChange={(e) => setLeadForm({ ...leadForm, nome: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contato">Contato *</Label>
                      <Input
                        id="contato"
                        value={leadForm.contato}
                        onChange={(e) => setLeadForm({ ...leadForm, contato: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={leadForm.email}
                        onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipoVeiculo">Tipo de Veículo</Label>
                      <Select value={leadForm.tipoVeiculo} onValueChange={(value) => setLeadForm({ ...leadForm, tipoVeiculo: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3/4">3/4</SelectItem>
                          <SelectItem value="Toco">Toco</SelectItem>
                          <SelectItem value="Truck">Truck</SelectItem>
                          <SelectItem value="Carreta">Carreta</SelectItem>
                          <SelectItem value="Van">Van</SelectItem>
                          <SelectItem value="Bongo">Bongo</SelectItem>
                          <SelectItem value="Cargovan">Cargovan</SelectItem>
                          <SelectItem value="Fiorino">Fiorino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={leadForm.status} onValueChange={(value: any) => setLeadForm({ ...leadForm, status: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="novo">Novo</SelectItem>
                          <SelectItem value="em_contato">Em Contato</SelectItem>
                          <SelectItem value="qualificado">Qualificado</SelectItem>
                          <SelectItem value="perdido">Perdido</SelectItem>
                          <SelectItem value="convertido">Convertido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="origem">Origem</Label>
                      <Input
                        id="origem"
                        placeholder="Ex: Indicação, Site, etc."
                        value={leadForm.origem}
                        onChange={(e) => setLeadForm({ ...leadForm, origem: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="proximoContato">Próximo Contato</Label>
                    <Input
                      id="proximoContato"
                      type="date"
                      value={leadForm.proximoContato}
                      onChange={(e) => setLeadForm({ ...leadForm, proximoContato: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={leadForm.observacoes}
                      onChange={(e) => setLeadForm({ ...leadForm, observacoes: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateLead}>
                    {editingLead ? "Atualizar" : "Criar"} Lead
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {leads.map((lead) => (
              <Card key={lead.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{lead.nome}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Phone className="h-3 w-3" />
                        {lead.contato}
                      </CardDescription>
                    </div>
                    <Badge className={statusColors[lead.status]}>
                      {statusLabels[lead.status]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {lead.email && (
                    <p className="text-sm flex items-center gap-1 text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {lead.email}
                    </p>
                  )}
                  {lead.tipoVeiculo && (
                    <p className="text-sm">
                      <span className="font-medium">Veículo:</span> {lead.tipoVeiculo}
                    </p>
                  )}
                  {lead.origem && (
                    <p className="text-sm">
                      <span className="font-medium">Origem:</span> {lead.origem}
                    </p>
                  )}
                  {lead.proximoContato && (
                    <p className="text-sm flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span className="font-medium">Próximo contato:</span>{" "}
                      {format(new Date(lead.proximoContato), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  )}
                  {lead.observacoes && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {lead.observacoes}
                    </p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEditLead(lead)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteLead(lead.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {leads.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  Nenhum lead cadastrado ainda.
                  <br />
                  Comece adicionando potenciais agregados!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="agenda" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={openLembreteDialog} onOpenChange={setOpenLembreteDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  Novo Lembrete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Lembrete</DialogTitle>
                  <DialogDescription>
                    Agende uma atividade ou contato
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título *</Label>
                    <Input
                      id="titulo"
                      value={lembreteForm.titulo}
                      onChange={(e) => setLembreteForm({ ...lembreteForm, titulo: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataHora">Data e Hora *</Label>
                      <Input
                        id="dataHora"
                        type="datetime-local"
                        value={lembreteForm.dataHora}
                        onChange={(e) => setLembreteForm({ ...lembreteForm, dataHora: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipo">Tipo</Label>
                      <Select value={lembreteForm.tipo} onValueChange={(value: any) => setLembreteForm({ ...lembreteForm, tipo: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ligacao">Ligação</SelectItem>
                          <SelectItem value="reuniao">Reunião</SelectItem>
                          <SelectItem value="email">E-mail</SelectItem>
                          <SelectItem value="visita">Visita</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={lembreteForm.descricao}
                      onChange={(e) => setLembreteForm({ ...lembreteForm, descricao: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateLembrete}>Criar Lembrete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Próximos 7 Dias
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lembretesProximos.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum lembrete agendado
                  </p>
                ) : (
                  lembretesProximos.map((lembrete) => (
                    <div
                      key={lembrete.id}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox
                        checked={lembrete.concluido}
                        onCheckedChange={() => toggleConcluido(lembrete.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`font-medium ${lembrete.concluido ? "line-through text-muted-foreground" : ""}`}>
                            {lembrete.titulo}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {tipoLembreteLabels[lembrete.tipo]}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(lembrete.dataHora), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                        {lembrete.descricao && (
                          <p className="text-sm text-muted-foreground">{lembrete.descricao}</p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteLembrete(lembrete.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
