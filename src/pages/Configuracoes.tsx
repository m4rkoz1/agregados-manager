import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCamposConfiguracao, CreateCampoConfiguracao } from "@/hooks/useCamposConfiguracao";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Move,
  Database,
  Type,
  Calendar,
  Hash,
  ToggleLeft,
  AlignLeft,
  List,
  Save
} from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface NovoCampo {
  campo_nome: string;
  campo_label: string;
  campo_tipo: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'textarea';
  campo_obrigatorio: boolean;
  campo_categoria: string;
  campo_opcoes: string;
}

const tipoIcones = {
  text: Type,
  number: Hash,
  date: Calendar,
  select: List,
  boolean: ToggleLeft,
  textarea: AlignLeft
};

const tipoLabels = {
  text: 'Texto',
  number: 'Número',
  date: 'Data',
  select: 'Seleção',
  boolean: 'Sim/Não',
  textarea: 'Texto Longo'
};

export default function Configuracoes() {
  const { campos, loading, createCampo, updateCampo, deleteCampo, getCamposByTabela, getCategorias, reordernarCampos } = useCamposConfiguracao();
  const { toast } = useToast();
  const [tabelaSelecionada, setTabelaSelecionada] = useState<string>('agregados_esporadicos');
  const [isNovoDialogOpen, setIsNovoDialogOpen] = useState(false);
  const [campoEditando, setCampoEditando] = useState<string | null>(null);
  const [novoCampo, setNovoCampo] = useState<NovoCampo>({
    campo_nome: '',
    campo_label: '',
    campo_tipo: 'text',
    campo_obrigatorio: false,
    campo_categoria: '',
    campo_opcoes: ''
  });

  const tabelas = [
    { valor: 'agregados_esporadicos', label: 'Agregados Esporádicos' },
    { valor: 'agregados', label: 'Agregados Fixos' }
  ];

  const camposTabela = getCamposByTabela(tabelaSelecionada);
  const categorias = getCategorias(tabelaSelecionada);

  const handleAdicionarCampo = async () => {
    if (!novoCampo.campo_nome || !novoCampo.campo_label) {
      toast({
        title: "Erro de validação",
        description: "Nome do campo e label são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const dadosNovoCampo: CreateCampoConfiguracao = {
      tabela_nome: tabelaSelecionada,
      campo_nome: novoCampo.campo_nome.toLowerCase().replace(/\s+/g, '_'),
      campo_label: novoCampo.campo_label,
      campo_tipo: novoCampo.campo_tipo,
      campo_obrigatorio: novoCampo.campo_obrigatorio,
      campo_categoria: novoCampo.campo_categoria || 'geral',
      campo_ordem: camposTabela.length + 1,
      campo_opcoes: novoCampo.campo_tipo === 'select' && novoCampo.campo_opcoes ? 
        novoCampo.campo_opcoes.split(',').map(o => o.trim()).filter(Boolean) : []
    };

    const sucesso = await createCampo(dadosNovoCampo);
    if (sucesso) {
      setIsNovoDialogOpen(false);
      setNovoCampo({
        campo_nome: '',
        campo_label: '',
        campo_tipo: 'text',
        campo_obrigatorio: false,
        campo_categoria: '',
        campo_opcoes: ''
      });
    }
  };

  const handleRemoverCampo = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este campo?')) {
      await deleteCampo(id);
    }
  };

  const handleToggleAtivo = async (id: string, ativo: boolean) => {
    await updateCampo(id, { campo_ativo: !ativo });
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(camposTabela);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const camposReordenados = items.map((item, index) => ({
      id: item.id,
      ordem: index + 1
    }));

    await reordernarCampos(camposReordenados);
  };

  const getCategoriaCapos = (categoria: string) => {
    return camposTabela.filter(campo => campo.campo_categoria === categoria);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Configurações do Sistema
        </h1>
        <p className="text-muted-foreground">
          Configure e personalize os campos dos formulários do sistema de forma dinâmica
        </p>
      </div>

      {/* Seleção de Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Selecionar Módulo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Módulo para Configurar</Label>
              <Select value={tabelaSelecionada} onValueChange={setTabelaSelecionada}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tabelas.map(tabela => (
                    <SelectItem key={tabela.valor} value={tabela.valor}>
                      {tabela.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Dialog open={isNovoDialogOpen} onOpenChange={setIsNovoDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Adicionar Campo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Novo Campo</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="campo_nome">Nome do Campo (técnico)</Label>
                      <Input
                        id="campo_nome"
                        value={novoCampo.campo_nome}
                        onChange={(e) => setNovoCampo(prev => ({ ...prev, campo_nome: e.target.value }))}
                        placeholder="ex: telefone_emergencia"
                      />
                    </div>

                    <div>
                      <Label htmlFor="campo_label">Label (exibição)</Label>
                      <Input
                        id="campo_label"
                        value={novoCampo.campo_label}
                        onChange={(e) => setNovoCampo(prev => ({ ...prev, campo_label: e.target.value }))}
                        placeholder="ex: Telefone de Emergência"
                      />
                    </div>

                    <div>
                      <Label htmlFor="campo_tipo">Tipo do Campo</Label>
                      <Select 
                        value={novoCampo.campo_tipo} 
                        onValueChange={(value: any) => setNovoCampo(prev => ({ ...prev, campo_tipo: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(tipoLabels).map(([valor, label]) => (
                            <SelectItem key={valor} value={valor}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="campo_categoria">Categoria</Label>
                      <Input
                        id="campo_categoria"
                        value={novoCampo.campo_categoria}
                        onChange={(e) => setNovoCampo(prev => ({ ...prev, campo_categoria: e.target.value }))}
                        placeholder="ex: contato, documentos"
                      />
                    </div>

                    {novoCampo.campo_tipo === 'select' && (
                      <div>
                        <Label htmlFor="campo_opcoes">Opções (separadas por vírgula)</Label>
                        <Textarea
                          id="campo_opcoes"
                          value={novoCampo.campo_opcoes}
                          onChange={(e) => setNovoCampo(prev => ({ ...prev, campo_opcoes: e.target.value }))}
                          placeholder="Opção 1, Opção 2, Opção 3"
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="campo_obrigatorio"
                        checked={novoCampo.campo_obrigatorio}
                        onCheckedChange={(checked) => setNovoCampo(prev => ({ ...prev, campo_obrigatorio: checked }))}
                      />
                      <Label htmlFor="campo_obrigatorio">Campo obrigatório</Label>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleAdicionarCampo} className="flex-1">
                        <Save className="w-4 h-4 mr-2" />
                        Salvar
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsNovoDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de C ampos por C ategoria */}
      <div className="space-y-4">
        {categorias.map(categoria => {
          const camposCategoria = getCategoriaCapos(categoria);
          
          return (
            <Card key={categoria}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="capitalize">{categoria}</span>
                  <Badge variant="secondary">{camposCategoria.length} campos</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId={`categoria-${categoria}`}>
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {camposCategoria.map((campo, index) => {
                          const IconeComponente = tipoIcones[campo.campo_tipo];
                          
                          return (
                            <Draggable key={campo.id} draggableId={campo.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`p-4 border rounded-lg bg-card ${
                                    snapshot.isDragging ? 'shadow-lg' : ''
                                  } ${!campo.campo_ativo ? 'opacity-50' : ''}`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div {...provided.dragHandleProps} className="cursor-move">
                                        <Move className="w-4 h-4 text-muted-foreground" />
                                      </div>
                                      <IconeComponente className="w-5 h-5 text-primary" />
                                      <div>
                                        <div className="font-medium">{campo.campo_label}</div>
                                        <div className="text-sm text-muted-foreground">
                                          {campo.campo_nome} • {tipoLabels[campo.campo_tipo]}
                                          {campo.campo_obrigatorio && (
                                            <Badge variant="destructive" className="ml-2 text-xs">
                                              Obrigatório
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      <Switch
                                        checked={campo.campo_ativo}
                                        onCheckedChange={() => handleToggleAtivo(campo.id, campo.campo_ativo)}
                                      />
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setCampoEditando(campo.id)}
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoverCampo(campo.id)}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>

                                  {campo.campo_opcoes && campo.campo_opcoes.length > 0 && (
                                    <div className="mt-2 pt-2 border-t">
                                      <div className="text-xs text-muted-foreground mb-1">Opções:</div>
                                      <div className="flex flex-wrap gap-1">
                                        {campo.campo_opcoes.map((opcao, idx) => (
                                          <Badge key={idx} variant="outline" className="text-xs">
                                            {opcao}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                {camposCategoria.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum campo nesta categoria
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {categorias.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhum campo configurado para este módulo.
                <br />
                Adicione o primeiro campo usando o botão acima.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}