# Descrição do Teste

Você foi contratado para desenvolver uma API RESTful para gerenciar os produtos de um supermercado/delivery. A API deve permitir o cadastro, listagem, atualização e exclusão de produtos, com autenticação baseada em JWT para proteger as rotas.

## Requisitos

- Desenvolver usando **Node.js** com **Express**
- Banco de dados: **PostgreSQL**
- Utilizar **JWT** para autenticação
- Aplicar as melhores práticas, como separação de responsabilidades (camadas: rotas, controladores, serviços)
- Testar as rotas usando ferramentas como **Postman** e anexar os prints dos resultado

## Requisitos Técnicos

### 1. Funcionalidades obrigatórias

#### 1.1 Autenticação

- Rota para login (`/auth/login`) que retorna um token JWT
- Rota para registro de usuários (`/auth/register`) com validação de campos (e.g., email único e senha forte)

#### 1.2 CRUD de produtos

##### Criação
- Rota para adicionar um novo produto (`POST /products`)
- Campos necessários:
  - name (string, obrigatório)
  - description (string, opcional)
  - price (float, obrigatório)
  - category (string, obrigatório)
  - stock (integer, obrigatório)

##### Listagem
- Rota para listar todos os produtos (`GET /products`)
- Permitir filtro por categoria e preço mínimo/máximo via query params

##### Atualização
- Rota para atualizar um produto (`PUT /products/:id`)
- Atualizar campos específicos

##### Exclusão
- Rota para deletar um produto (`DELETE /products/:id`)

#### 1.3 Proteção de rotas
- Todas as rotas de produtos devem exigir autenticação via JWT

#### 1.4 Validações
- Certifique-se de que os campos obrigatórios sejam validados no backend
- Retorne mensagens de erro claras para entradas inválidas

### 2. Bônus (Diferenciais)

#### 2.1 Documentação
- Criar documentação da API usando **Swagger** ou **Postman**

#### 2.2 Testes unitários
- Implementar testes para as rotas principais usando **Jest** ou outra biblioteca de sua escolha

#### 2.3 Upload de imagens
- Permitir o upload de uma imagem para o produto e armazenar no sistema de arquivos ou em um serviço de armazenamento como **AWS S3**

#### 2.4 Paginação
- Adicionar paginação à rota de listagem de produtos

## Diretrizes de Implementação

### 1. Configuração inicial
- Crie um projeto Node.js
- Configure o banco de dados com conexão segura (use variáveis de ambiente)
- Configure um middleware para logs de requisições (ex: **morgan**)

### 2. Estrutura de pastas sugerida

```
├── src
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── services
│   ├── middlewares
│   ├── utils
│   └── app.js
├── tests
├── .env
├── package.json
└── README.md
```

### 3. Middleware de autenticação
- Crie um middleware para validar o token JWT em rotas protegidas

### 4. Resposta padrão
- Todas as respostas da API devem seguir o formato JSON:

```json
{
    "success": true,
    "message": "Descrição da ação",
    "data": { ... }
}
```

## Entrega

1. Subir o código em um repositório no GitHub (privado ou público)
2. Incluir um arquivo **README.md** com as instruções para rodar o projeto e exemplos das rotas disponíveis
3. Fornecer um arquivo de exportação de requisições do Postman para os testes das rotas
4. Anexar no email as evidencias dos testes de rotas e telas criadas
