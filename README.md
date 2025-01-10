# API de Supermercado

Uma API RESTful completa para gerenciamento de produtos de supermercado, com autenticação JWT, gerenciamento de produtos e recursos avançados de filtragem.

## Funcionalidades

- 🔐 Autenticação JWT
- 📦 Operações CRUD Completas para Produtos
- 🔍 Filtragem Avançada de Produtos
- 📄 Documentação da API com Swagger
- 🖼️ Upload de Imagens de Produtos
- 🐳 Container Docker para PostgreSQL
- ✅ Testes Unitários com Jest e Supertest
- 📝 Registro de Requisições com Morgan
- 🔄 Suporte a TypeScript
- 🗃️ Banco de Dados PostgreSQL com TypeORM
- 📈 Qualidade de Código com ESLint
- 📦 Upload de Arquivos com Multer
- 📝 Validação de Entrada com Express Validator

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Express.js
- TypeORM
- PostgreSQL
- Docker & Docker Compose
- JWT para Autenticação
- Swagger para Documentação da API
- Jest & Supertest para Testes
- ESLint para Qualidade de Código
- Morgan para Registro de Requisições
- Multer para Upload de Arquivos
- Express Validator para Validação de Dados

## Pré-requisitos

- Node.js (v16 ou superior)
- Docker e Docker Compose
- npm ou yarn

## Estrutura do Projeto

```
├── src/
│   ├── controllers/    # Controladores de requisições
│   ├── models/        # Modelos do banco de dados
│   ├── routes/        # Rotas da API
│   ├── services/      # Lógica de negócios
│   ├── middlewares/   # Middlewares personalizados
│   ├── utils/         # Funções auxiliares
│   ├── config/        # Arquivos de configuração
│   └── server.ts      # Ponto de entrada da aplicação
├── tests/            # Arquivos de teste
├── coverage/         # Relatórios de cobertura de testes
├── uploads/         # Armazenamento de imagens
├── docker-compose.yml # Configuração Docker
└── dist/            # Arquivos JavaScript compilados
```

## Configuração e Instalação

1. Clone o repositório

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env` com as seguintes variáveis:
```env
PORT=3333
JWT_SECRET=seu_segredo_jwt
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=supermarket_db
```

4. Inicie o banco de dados PostgreSQL com Docker:
```bash
docker-compose up -d
```

5. Execute as migrações do banco:
```bash
npm run typeorm migration:run
```

6. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Scripts Disponíveis

- `npm start`: Executa o servidor em produção
- `npm run dev`: Executa o servidor em desenvolvimento com hot-reload
- `npm run build`: Compila o código TypeScript
- `npm test`: Executa os testes
- `npm run test:watch`: Executa os testes em modo watch
- `npm run test:coverage`: Executa os testes com relatório de cobertura
- `npm run typeorm`: Executa comandos do TypeORM CLI

## Documentação da API

A documentação da API está disponível através do Swagger UI. Para acessar:

1. Inicie o servidor
2. Acesse no navegador:
```
http://localhost:3333/api-docs
```

A interface do Swagger fornece documentação detalhada para todos os endpoints da API, incluindo:

### Autenticação
- **POST** `/api/auth/login` - Login de usuário
- **POST** `/api/auth/register` - Registro de novo usuário

### Produtos (Rotas Protegidas)
- **GET** `/api/products` - Lista todos os produtos
  - Suporta filtros por categoria e preço
  - Inclui paginação
- **GET** `/api/products/:id` - Obtém detalhes de um produto
- **POST** `/api/products` - Cria um novo produto
- **PUT** `/api/products/:id` - Atualiza um produto
- **DELETE** `/api/products/:id` - Remove um produto
- **POST** `/api/products/:id/image` - Upload de imagem do produto

## Documentação do Projeto

- Os requisitos e especificações principais da API estão em `api-requirements.md`
- A documentação da API está disponível via Swagger UI no endpoint `/api-docs`
- O código segue padrões de qualidade verificados pelo ESLint

## Respostas da API

Todas as respostas seguem o formato JSON padrão:

```json
{
    "success": true,
    "message": "Descrição da ação",
    "data": { }
}
```

## Códigos de Status HTTP

A API utiliza os códigos de status HTTP padrão:
- `200`: Sucesso
- `201`: Criado
- `400`: Requisição Inválida
- `401`: Não Autorizado
- `404`: Não Encontrado
- `500`: Erro Interno do Servidor
