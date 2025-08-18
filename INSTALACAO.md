# Guia de Instalação - Sistema de Gestão de Agregados

Este guia te ajudará a instalar e configurar o sistema de gestão de agregados em seu ambiente local.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em seu computador:

- **Node.js** (versão 18 ou superior) - [Download aqui](https://nodejs.org/)
- **Git** - [Download aqui](https://git-scm.com/)
- Uma conta no **Supabase** - [Criar conta](https://supabase.com/)

## 🚀 Instalação Passo a Passo

### 1. Clone o Repositório

```bash
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
cd SEU_REPOSITORIO
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configuração do Banco de Dados (Supabase)

#### 3.1 Crie um Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com/)
2. Faça login e clique em "New Project"
3. Escolha sua organização e defina:
   - Nome do projeto
   - Senha do banco de dados (guarde essa senha!)
   - Região (recomendado: South America)

#### 3.2 Configure as Variáveis de Ambiente
1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. No painel do Supabase, vá em **Settings > API** e copie:
   - Project URL
   - Anon public key

3. Edite o arquivo `.env` com suas credenciais:
```env
VITE_SUPABASE_URL=sua_project_url_aqui
VITE_SUPABASE_PUBLISHABLE_KEY=sua_anon_key_aqui
VITE_SUPABASE_PROJECT_ID=seu_project_id_aqui
```

#### 3.3 Execute as Migrações do Banco
1. No painel do Supabase, vá em **SQL Editor**
2. Execute o SQL da migração localizado em `supabase/migrations/` para criar as tabelas necessárias

### 4. Inicie o Servidor de Desenvolvimento

```bash
npm run dev
```

O sistema estará disponível em `http://localhost:8080`

## 📊 Configuração das Políticas de Segurança (RLS)

O sistema utiliza Row Level Security (RLS) do Supabase. As políticas já estão configuradas nas migrações, mas certifique-se de que:

1. RLS está habilitado em todas as tabelas
2. As políticas de acesso estão ativas
3. A autenticação está funcionando corretamente

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm run preview` - Visualiza a build de produção localmente
- `npm run lint` - Executa o linter de código

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── dashboard/      # Componentes do dashboard
│   ├── layout/         # Layout da aplicação
│   └── ui/             # Componentes de interface (shadcn/ui)
├── hooks/              # Hooks customizados
├── integrations/       # Integrações (Supabase)
├── lib/                # Utilitários e helpers
└── pages/              # Páginas da aplicação
```

## 🌟 Funcionalidades

- **Cadastro de Agregados**: Registro completo de motoristas e proprietários
- **Agregados Esporádicos**: Gestão de motoristas temporários
- **Dashboard**: Visão geral com métricas e alertas
- **Relatórios**: Exportação personalizada para Excel
- **Gestão de Frota**: Controle da frota atual

## 🔒 Segurança

O sistema implementa:
- Autenticação via Supabase Auth
- Row Level Security (RLS) para proteção de dados
- Validação de formulários com Zod
- Sanitização de dados de entrada

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Formulários**: React Hook Form + Zod
- **Roteamento**: React Router DOM
- **Exportação**: XLSX para relatórios Excel

## 📝 Troubleshooting

### Erro de Conexão com Supabase
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo
- Verifique a configuração de CORS se necessário

### Erro de Permissões
- Certifique-se de que as políticas RLS estão configuradas
- Verifique se o usuário tem as permissões necessárias

### Problemas de Build
- Execute `npm install` novamente
- Limpe o cache: `npm run build -- --force`
- Verifique se todas as dependências estão atualizadas

## 📞 Suporte

Se você encontrar problemas durante a instalação:

1. Verifique se todos os pré-requisitos foram atendidos
2. Consulte a documentação do [Supabase](https://supabase.com/docs)
3. Abra uma issue neste repositório com detalhes do erro

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ para gestão eficiente de agregados de transporte**