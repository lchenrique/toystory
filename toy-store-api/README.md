# 🏪 Loja de Brinquedos - Backend API

API REST completa para sistema de gestão de loja de brinquedos desenvolvida com Node.js, Express, TypeScript e PostgreSQL.

## ✨ Características

### 🔐 Segurança e Autenticação
- **JWT Authentication**: Sistema de autenticação seguro
- **bcrypt**: Hash seguro de senhas
- **Rate Limiting**: Proteção contra ataques de força bruta
- **Helmet**: Headers de segurança HTTP
- **CORS**: Configuração de origens permitidas
- **Validação Zod**: Validação robusta de dados

### 📊 Funcionalidades Principais
- **CRUD Completo**: Clientes, vendas e usuários
- **Estatísticas Avançadas**: Análises de vendas e performance
- **Sistema de Filtros**: Busca e ordenação inteligente
- **Algoritmo de Letras Faltantes**: Identificação de caracteres ausentes
- **Testes Automatizados**: Cobertura completa com Jest
- **Documentação Automática**: Endpoints bem documentados

### 🛠️ Tecnologias Utilizadas
- **Node.js 18+** com TypeScript
- **Express.js** para servidor web
- **PostgreSQL** com Prisma ORM
- **JWT** para autenticação
- **Jest** para testes
- **Zod** para validação
- **Helmet** para segurança

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- PostgreSQL 12+
- pnpm (recomendado) ou npm

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd toy-store-api
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env
```

Edite o arquivo `.env`:
```env
# Configuração do Banco de Dados
DATABASE_URL="postgresql://username:password@localhost:5432/toy_store_db"

# Configuração JWT (mínimo 32 caracteres)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-minimum-32-chars"
JWT_EXPIRES_IN="24h"

# Configuração do Servidor
PORT=3001
NODE_ENV="development"

# Configuração CORS
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"

# Configuração Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

4. **Configure o banco de dados**
```bash
# Gere o cliente Prisma
pnpm db:generate

# Execute as migrações
pnpm db:migrate

# (Opcional) Popule com dados de exemplo
pnpm db:seed
```

5. **Inicie o servidor**
```bash
# Desenvolvimento
pnpm dev

# Produção
pnpm build
pnpm start
```

## 📚 Endpoints da API

### 🔐 Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/auth/register` | Registrar novo usuário |
| `POST` | `/api/auth/login` | Fazer login |

### 👥 Clientes
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/customers` | Listar clientes (com filtros) |
| `POST` | `/api/customers` | Criar novo cliente |
| `GET` | `/api/customers/:id` | Buscar cliente por ID |
| `PUT` | `/api/customers/:id` | Atualizar cliente |
| `DELETE` | `/api/customers/:id` | Excluir cliente |

### 💰 Vendas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/sales` | Listar todas as vendas |
| `POST` | `/api/sales` | Criar nova venda |
| `GET` | `/api/sales/customer/:customerId` | Vendas por cliente |

### 📊 Estatísticas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/statistics/daily-sales` | Vendas diárias |
| `GET` | `/api/statistics/top-customers` | Top clientes |
| `GET` | `/api/statistics/client-highlights` | Destaques de clientes |

## 🔐 Autenticação

Todas as rotas (exceto `/api/auth/*`) requerem autenticação via JWT:

```bash
Authorization: Bearer <token>
```

### Exemplo de Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

## 📊 Formato de Resposta

### Clientes
```json
{
  "data": {
    "clientes": [
      {
        "info": {
          "nomeCompleto": "Ana Beatriz Silva",
          "detalhes": {
            "email": "ana.b@example.com",
            "nascimento": "1992-05-01"
          }
        },
        "estatisticas": {
          "vendas": [
            { "data": "2024-01-01", "valor": 150.00 },
            { "data": "2024-01-02", "valor": 75.50 }
          ]
        }
      }
    ]
  },
  "meta": {
    "registroTotal": 1,
    "pagina": 1
  },
  "redundante": {
    "status": "ok"
  }
}
```

### Estatísticas
```json
{
  "dailySales": [
    {
      "date": "2024-01-01",
      "total": 1250.00
    }
  ],
  "clientHighlights": {
    "highestVolume": {
      "clientId": "1",
      "name": "João Silva",
      "total": 5000.00
    },
    "highestAverage": {
      "clientId": "2", 
      "name": "Maria Santos",
      "average": 250.00
    }
  }
}
```

## 🏗️ Estrutura do Projeto

```
src/
├── controllers/          # Controladores da API
│   ├── authController.ts    # Autenticação
│   ├── customerController.ts # Gestão de clientes
│   ├── saleController.ts    # Gestão de vendas
│   └── statisticsController.ts # Estatísticas
├── middlewares/         # Middlewares customizados
│   ├── auth.ts            # Autenticação JWT
│   └── validation.ts      # Validação de dados
├── routes/              # Definição de rotas
│   ├── authRoutes.ts      # Rotas de autenticação
│   ├── customerRoutes.ts  # Rotas de clientes
│   ├── saleRoutes.ts      # Rotas de vendas
│   └── statisticsRoutes.ts # Rotas de estatísticas
├── services/            # Lógica de negócio
│   ├── customerService.ts # Serviços de clientes
│   ├── saleService.ts     # Serviços de vendas
│   ├── statisticsService.ts # Serviços de estatísticas
│   └── userService.ts     # Serviços de usuários
├── types/               # Tipos TypeScript
│   └── index.ts
├── utils/               # Utilitários
│   ├── auth.ts            # Utilitários de autenticação
│   └── database.ts        # Configuração do banco
├── config/              # Configurações
│   └── env.ts             # Variáveis de ambiente
└── __tests__/           # Testes automatizados
    ├── auth.test.ts       # Testes de autenticação
    ├── customers.test.ts  # Testes de clientes
    ├── statistics.test.ts # Testes de estatísticas
    └── setup.ts           # Configuração dos testes
```

## 🧪 Testes

### Executar Testes
```bash
# Todos os testes
pnpm test

# Modo watch
pnpm test:watch

# Cobertura
pnpm test -- --coverage
```

### Estrutura dos Testes
- **Testes Unitários**: Funções e serviços isolados
- **Testes de Integração**: Endpoints da API
- **Testes de Autenticação**: Login e registro
- **Testes de Validação**: Schemas Zod

## 🛡️ Segurança

### Headers de Segurança (Helmet)
- **X-Content-Type-Options**: Previne MIME sniffing
- **X-Frame-Options**: Proteção contra clickjacking
- **X-XSS-Protection**: Proteção XSS
- **Strict-Transport-Security**: Força HTTPS

### Rate Limiting
- **Janela**: 15 minutos
- **Limite**: 100 requisições por IP
- **Headers**: X-RateLimit-* informativos

### Validação de Dados
- **Zod Schemas**: Validação em tempo de execução
- **Sanitização**: Limpeza de dados de entrada
- **Type Safety**: TypeScript para validação estática

## 📝 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia em modo desenvolvimento |
| `pnpm build` | Compila o projeto |
| `pnpm start` | Inicia em modo produção |
| `pnpm test` | Executa testes |
| `pnpm test:watch` | Executa testes em modo watch |
| `pnpm db:generate` | Gera cliente Prisma |
| `pnpm db:migrate` | Executa migrações |
| `pnpm db:studio` | Abre Prisma Studio |
| `pnpm db:seed` | Popula banco com dados de exemplo |

## 🔧 Configurações

### Prisma
- **ORM**: Prisma com PostgreSQL
- **Migrations**: Controle de versão do banco
- **Studio**: Interface visual para dados
- **Seeding**: Dados de exemplo automáticos

### Express
- **CORS**: Configuração de origens
- **JSON**: Parser para requisições
- **Helmet**: Headers de segurança
- **Rate Limiting**: Proteção contra spam

### TypeScript
- **Strict Mode**: Configuração rigorosa
- **ESLint**: Linting automático
- **Path Mapping**: Aliases para imports
- **Type Checking**: Verificação em tempo real

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

## 🚀 Deploy

### Build de Produção
```bash
pnpm build
```

### Variáveis de Produção
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
JWT_SECRET=your-production-secret
```

### Docker (Opcional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

## 👨‍💻 Desenvolvido por

Carlos Henrique 