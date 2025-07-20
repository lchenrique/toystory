# 🏪 Loja de Brinquedos - Frontend

Sistema de gestão completo para loja de brinquedos desenvolvido com React, TypeScript e Vite.

## ✨ Características

### 🎨 Interface Moderna
- **Design Responsivo**: Adaptável a desktop, tablet e mobile
- **Tema Escuro/Azul**: Interface elegante com gradientes azuis
- **Sidebar Fixo**: Navegação sempre acessível com estatísticas em tempo real
- **Layout Otimizado**: Sidebar fixo, conteúdo scrollável

### 📊 Funcionalidades Principais
- **Painel Principal**: Visão geral com estatísticas e insights
- **Gestão de Clientes**: CRUD completo com busca e ordenação
- **Estatísticas Avançadas**: Gráficos e análises de vendas
- **Sistema de Autenticação**: Login/registro com validações
- **Letras Faltantes**: Algoritmo para identificar letras ausentes nos nomes

### 🛠️ Tecnologias Utilizadas
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **React Router** para navegação
- **React Hook Form** para formulários
- **Tailwind CSS** para estilização
- **Chart.js** para gráficos
- **Context API** para gerenciamento de estado

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- pnpm (recomendado) ou npm

### Instalação
```bash
# Instalar dependências
pnpm install

# Executar em modo desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Preview do build
pnpm preview
```

### Configuração
1. Certifique-se de que o backend está rodando na porta 3001
2. O frontend rodará automaticamente na porta 5173
3. Acesse: http://localhost:5173

## 📁 Estrutura do Projeto

```
src/
├── components/
│   └── layout/
│       ├── Header.tsx      # Cabeçalho com menu do usuário
│       ├── Sidebar.tsx     # Menu lateral com navegação
│       ├── Footer.tsx      # Rodapé
│       └── MainLayout.tsx  # Layout principal
├── pages/
│   ├── Dashboard.tsx       # Painel principal
│   ├── ClientList.tsx      # Lista de clientes
│   ├── ClientForm.tsx      # Formulário de cliente
│   ├── Statistics.tsx      # Estatísticas e gráficos
│   ├── Login.tsx          # Página de login
│   └── Register.tsx       # Página de registro
├── services/
│   ├── api.ts             # Configuração da API
│   ├── authService.ts     # Serviços de autenticação
│   ├── clientService.ts   # Serviços de clientes
│   └── statisticsService.ts # Serviços de estatísticas
├── contexts/
│   └── AuthContext.tsx    # Contexto de autenticação
├── utils/
│   ├── dataNormalization.ts # Normalização de dados
│   └── missingLetter.ts   # Algoritmo de letras faltantes
└── types/
    └── index.ts           # Tipos TypeScript
```

## 🎯 Funcionalidades Detalhadas

### Dashboard
- **Estatísticas em Tempo Real**: Total de clientes, vendas, médias
- **Ações Rápidas**: Links diretos para funcionalidades principais
- **Insights Visuais**: Cards informativos com gradientes
- **Visão Geral do Sistema**: Status de conectividade e dados

### Gestão de Clientes
- **Listagem Inteligente**: Busca por nome/email, ordenação por múltiplos campos
- **CRUD Completo**: Criar, editar, visualizar e excluir clientes
- **Letras Faltantes**: Identificação automática de letras ausentes nos nomes
- **Interface Responsiva**: Adaptável a diferentes tamanhos de tela

### Estatísticas
- **Gráficos Interativos**: Tendência de vendas diárias com Chart.js
- **Filtros de Período**: Seleção de datas personalizada
- **Destaques de Clientes**: Maior volume, média e frequência
- **Resumo Executivo**: Métricas consolidadas

### Autenticação
- **Login Seguro**: Validação de credenciais
- **Registro de Usuários**: Formulário com validações robustas
- **Contexto Global**: Estado de autenticação persistente
- **Redirecionamento Inteligente**: Navegação baseada em autenticação

## 🎨 Design System

### Cores
- **Primária**: Azul (#3B82F6)
- **Secundária**: Roxo (#8B5CF6)
- **Sucesso**: Verde (#10B981)
- **Aviso**: Amarelo (#F59E0B)
- **Erro**: Vermelho (#EF4444)

### Componentes
- **Cards**: Bordas arredondadas com sombras suaves
- **Botões**: Gradientes e hover effects
- **Formulários**: Validação visual em tempo real
- **Tabelas**: Design limpo com hover effects

## 🔧 Configurações

### Vite
- **Hot Module Replacement**: Atualizações instantâneas
- **TypeScript**: Configuração estrita
- **Aliases**: `@/` para `src/`

### Tailwind CSS
- **Configuração Customizada**: Cores e espaçamentos personalizados
- **Classes Utilitárias**: Sistema de design consistente
- **Responsividade**: Breakpoints otimizados

### ESLint
- **Regras TypeScript**: Linting estrito
- **React Hooks**: Verificação de dependências
- **Import/Export**: Organização automática

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Adaptações
- **Sidebar**: Colapsável em telas pequenas
- **Tabelas**: Scroll horizontal em mobile
- **Formulários**: Layout vertical em mobile
- **Gráficos**: Responsivos com zoom

## 🚀 Deploy

### Build de Produção
```bash
pnpm build
```

### Servidor de Produção
```bash
pnpm preview
```

### Variáveis de Ambiente
```env
VITE_API_URL=http://localhost:3001
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

## 👨‍💻 Desenvolvido por

Carlos Henrique
