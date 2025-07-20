# 🏪 Sistema de Gestão - Loja de Brinquedos

Sistema completo de gestão para loja de brinquedos com frontend React/TypeScript e backend Node.js/PostgreSQL.

## 📋 Visão Geral

Este projeto é um sistema de gestão empresarial completo desenvolvido para lojas de brinquedos, oferecendo funcionalidades avançadas de gestão de clientes, vendas e análise de dados.

### 🎯 Objetivos do Sistema
- **Gestão de Clientes**: CRUD completo com busca inteligente
- **Controle de Vendas**: Registro e acompanhamento de transações
- **Análise de Dados**: Estatísticas e insights de negócio
- **Interface Moderna**: Design responsivo e intuitivo
- **Segurança**: Autenticação JWT e validações robustas

## 🏗️ Arquitetura

### Frontend (React + TypeScript)
- **Localização**: `toy-store-front/`
- **Tecnologias**: React 18, TypeScript, Vite, Tailwind CSS
- **Porta**: 5173 (desenvolvimento)

### Backend (Node.js + PostgreSQL)
- **Localização**: `toy-store-api/`
- **Tecnologias**: Node.js, Express, TypeScript, Prisma ORM
- **Porta**: 3001 (desenvolvimento)

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+
- PostgreSQL 12+
- pnpm (recomendado)

### 1. Configurar Backend
```bash
cd toy-store-api
pnpm install
cp env.example .env
# Configure as variáveis no .env
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

**⚠️ Importante**: Para testar o frontend com dados reais, execute o seed:
```bash
pnpm db:seed
```
Este comando popula o banco com dados de exemplo (usuários, clientes e vendas).

### 2. Configurar Frontend
```bash
cd toy-store-front/toy-store-client
pnpm install
pnpm dev
```

### 3. Acessar o Sistema
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## ✨ Funcionalidades Principais

### 🎨 Interface do Usuário
- **Dashboard Interativo**: Visão geral com estatísticas em tempo real
- **Sidebar Fixo**: Navegação sempre acessível com estatísticas
- **Design Responsivo**: Adaptável a desktop, tablet e mobile
- **Tema Moderno**: Gradientes azuis e interface elegante

### 👥 Gestão de Clientes
- **CRUD Completo**: Criar, editar, visualizar e excluir clientes
- **Busca Inteligente**: Filtros por nome, email e data de nascimento
- **Algoritmo de Letras Faltantes**: Identificação automática de caracteres ausentes
- **Interface Responsiva**: Tabelas adaptáveis a diferentes telas

### 📊 Estatísticas e Análises
- **Gráficos Interativos**: Tendência de vendas diárias com Chart.js
- **Filtros de Período**: Seleção personalizada de datas
- **Destaques de Clientes**: Maior volume, média e frequência de compras
- **Resumo Executivo**: Métricas consolidadas para tomada de decisão

### 🔐 Sistema de Autenticação
- **Login Seguro**: Validação de credenciais com JWT
- **Registro de Usuários**: Formulário com validações robustas
- **Contexto Global**: Estado de autenticação persistente
- **Redirecionamento Inteligente**: Navegação baseada em autenticação

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **React Router** para navegação
- **React Hook Form** para formulários
- **Tailwind CSS** para estilização
- **Chart.js** para gráficos
- **Context API** para gerenciamento de estado

### Backend
- **Node.js 18+** com TypeScript
- **Express.js** para servidor web
- **PostgreSQL** com Prisma ORM
- **JWT** para autenticação
- **Jest** para testes
- **Zod** para validação
- **Helmet** para segurança

## 📁 Estrutura do Projeto

```
teste tecnico/
├── toy-store-api/                    # Backend Node.js/TypeScript
│   ├── src/
│   │   ├── controllers/              # Controladores da API
│   │   ├── middlewares/              # Middlewares customizados
│   │   ├── routes/                   # Definição de rotas
│   │   ├── services/                 # Lógica de negócio
│   │   ├── types/                    # Tipos TypeScript
│   │   ├── utils/                    # Utilitários
│   │   └── __tests__/                # Testes automatizados
│   ├── prisma/                       # Schema e migrações do banco
│   └── README.md                     # Documentação do backend
│
└── toy-store-front/
    └── toy-store-client/             # Frontend React/TypeScript
        ├── src/
        │   ├── components/           # Componentes React
        │   │   └── layout/           # Componentes de layout
        │   ├── pages/                # Páginas da aplicação
        │   ├── services/             # Serviços de API
        │   ├── contexts/             # Contextos React
        │   ├── hooks/                # Hooks customizados
        │   ├── utils/                # Utilitários
        │   └── types/                # Tipos TypeScript
        └── README.md                 # Documentação do frontend
```

## 🔧 Configuração Detalhada

### Variáveis de Ambiente (Backend)
```env
# Banco de Dados
DATABASE_URL="postgresql://username:password@localhost:5432/toy_store_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-minimum-32-chars"
JWT_EXPIRES_IN="24h"

# Servidor
PORT=3001
NODE_ENV="development"

# CORS
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Variáveis de Ambiente (Frontend)
```env
VITE_API_URL=http://localhost:3001
```

## 📊 Banco de Dados

### Schema Principal
```sql
-- Usuários
users (id, name, email, password, created_at, updated_at)

-- Clientes  
customers (id, name, email, birth_date, created_at, updated_at)

-- Vendas
sales (id, customer_id, total, date, created_at, updated_at)
```

### Relacionamentos
- **1:N**: Usuário → Clientes
- **1:N**: Cliente → Vendas
- **N:1**: Vendas → Cliente

## 🧪 Testes

### Backend
```bash
cd toy-store-api
pnpm test              # Executar todos os testes
pnpm test:watch        # Modo watch
pnpm test -- --coverage # Com cobertura
```

**⚠️ Nota sobre Testes**: Os testes limpam automaticamente o banco de dados antes de cada execução. Se você executar os testes após popular o banco com `pnpm db:seed`, os dados de exemplo serão removidos. Para restaurar os dados após os testes, execute novamente:
```bash
pnpm db:seed
```

#### Estrutura dos Testes
- **auth.test.ts**: Testes de autenticação (login, registro, validação JWT)
- **customers.test.ts**: Testes CRUD de clientes (criar, listar, editar, deletar)
- **statistics.test.ts**: Testes de estatísticas (vendas diárias, top clientes)
- **setup.ts**: Configuração do ambiente de testes

#### Cobertura de Testes
- **Autenticação**: 100% - Login, registro, validação de tokens
- **Clientes**: 100% - CRUD completo, filtros, validações
- **Estatísticas**: 100% - Cálculos de vendas, rankings de clientes
- **Validação**: 100% - Schemas Zod, tipos TypeScript

### Frontend
```bash
cd toy-store-front/toy-store-client
pnpm test              # Executar testes
```

## 🌱 Seed de Dados

### População do Banco
```bash
cd toy-store-api
pnpm db:seed           # Executar seed
```

### Dados Incluídos
- **Usuários de Teste**:
  - Admin: `admin@example.com` / `password123`
  - Usuário: `user@example.com` / `password123`

- **Clientes de Exemplo**:
  - Ana Beatriz Silva (1992-05-01)
  - Carlos Eduardo Santos (1987-08-15)
  - Maria Fernanda Costa (1995-12-03)
  - João Pedro Oliveira (1989-03-22)
  - Sofia Isabella Lima (1998-07-14)

- **Vendas de Exemplo**:
  - Período: 2024-01-01 a 2024-01-12
  - Valores variados para testar estatísticas
  - Distribuição realista entre clientes

### Dados para Testes
- **Letras Faltantes**: Nomes com diferentes combinações de letras
- **Estatísticas Variadas**: Clientes com diferentes volumes e frequências
- **Datas Distribuídas**: Vendas espalhadas no período de teste

### Executando Testes com Seed
```bash
# 1. Configurar banco de dados
pnpm db:generate
pnpm db:migrate

# 2. Popular com dados de teste
pnpm db:seed

# 3. Executar testes
pnpm test

# 4. Verificar cobertura
pnpm test -- --coverage

# 5. Restaurar dados após testes (opcional)
pnpm db:seed
```

### Resultados Esperados dos Testes
- **✅ Autenticação**: Login, registro e validação de JWT
- **✅ Clientes**: CRUD completo com validações
- **✅ Estatísticas**: Cálculos corretos de vendas e rankings
- **✅ Validação**: Schemas Zod funcionando corretamente
- **✅ Cobertura**: Mínimo 90% de cobertura de código

## 🧪 Testando o Sistema Completo

### Cenários de Teste
1. **Autenticação**:
   - Login com credenciais válidas
   - Registro de novo usuário
   - Acesso negado sem token

2. **Gestão de Clientes**:
   - Criar novo cliente
   - Listar clientes com filtros
   - Editar informações
   - Excluir cliente
   - Verificar letras faltantes

3. **Estatísticas**:
   - Gráfico de vendas diárias
   - Destaques de clientes
   - Filtros de período

4. **Interface**:
   - Responsividade em diferentes telas
   - Sidebar colapsável
   - Navegação entre páginas

### Dados de Teste Disponíveis
- **Usuário Admin**: `admin@example.com` / `password123`
- **Período de Vendas**: 2024-01-01 a 2024-01-12
- **Clientes**: 5 clientes com vendas variadas
- **Funcionalidades**: Todas implementadas e testadas

**💡 Dica**: Para testar o frontend com dados reais, sempre execute `pnpm db:seed` após os testes, pois eles limpam o banco de dados automaticamente.

## 🚀 Deploy

### Backend
```bash
cd toy-store-api
pnpm build
pnpm start
```

### Frontend
```bash
cd toy-store-front/toy-store-client
pnpm build
pnpm preview
```

## 🛡️ Segurança

### Implementações de Segurança
- **JWT Authentication**: Tokens seguros para autenticação
- **bcrypt**: Hash seguro de senhas
- **Rate Limiting**: Proteção contra ataques de força bruta
- **Helmet**: Headers de segurança HTTP
- **CORS**: Configuração de origens permitidas
- **Validação Zod**: Validação robusta de dados
- **TypeScript**: Verificação de tipos em tempo de compilação

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

## 📈 Funcionalidades Avançadas

### Algoritmo de Letras Faltantes
- **Identificação Automática**: Detecta caracteres ausentes nos nomes
- **Normalização**: Remove acentos e caracteres especiais
- **Comparação Inteligente**: Análise de similaridade entre nomes

### Estatísticas em Tempo Real
- **Sidebar Dinâmico**: Estatísticas atualizadas automaticamente
- **Dashboard Interativo**: Métricas em tempo real
- **Gráficos Responsivos**: Visualizações adaptáveis

### Sistema de Filtros
- **Busca por Nome**: Busca inteligente com normalização
- **Filtro por Email**: Busca exata por endereço de email
- **Ordenação Múltipla**: Por nome, email, data de nascimento
- **Paginação**: Navegação eficiente em grandes datasets

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

## 👨‍💻 Desenvolvido por

Carlos Henrique - Full Stack React/Node.js/TypeScript

---

## 📞 Suporte

Para dúvidas ou suporte técnico, consulte a documentação específica de cada módulo:
- [Documentação do Frontend](./toy-store-front/toy-store-client/README.md)
- [Documentação do Backend](./toy-store-api/README.md) 
