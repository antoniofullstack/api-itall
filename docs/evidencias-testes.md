# Evidências de Testes - Supermarket API

Este documento contém as evidências dos testes realizados na API do Supermercado, incluindo screenshots das requisições e respostas.

## 1. Autenticação

### 1.1 Registro de Usuário
**Endpoint:** POST `/api/auth/register`

![Registro de Usuário](./screenshots/auth-register.png)

### 1.2 Login
**Endpoint:** POST `/api/auth/login`

![Login](./screenshots/auth-login.png)

## 2. Gerenciamento de Produtos

### 2.1 Criação de Produto
**Endpoint:** POST `/api/products`

![Criar Produto](./screenshots/product-create.png)

### 2.2 Listagem de Produtos
**Endpoint:** GET `/api/products`

![Listar Produtos](./screenshots/product-list.png)

#### 2.2.1 Listagem com Filtros
**Endpoint:** GET `/api/products?category=bebidas&minPrice=10&maxPrice=50`

![Listar Produtos com Filtros](./screenshots/product-list-filters.png)

### 2.3 Detalhes do Produto
**Endpoint:** GET `/api/products/:id`

![Detalhes do Produto](./screenshots/product-details.png)

### 2.4 Atualização de Produto
**Endpoint:** PUT `/api/products/:id`

![Atualizar Produto](./screenshots/product-update.png)

### 2.5 Upload de Imagem
**Endpoint:** POST `/api/products/:id/image`

![Upload de Imagem](./screenshots/product-image-upload.png)

### 2.6 Exclusão de Produto
**Endpoint:** DELETE `/api/products/:id`

![Deletar Produto](./screenshots/product-delete.png)

## 3. Validações e Tratamento de Erros

### 3.1 Tentativa de Acesso sem Autenticação
![Erro de Autenticação](./screenshots/error-unauthorized.png)

### 3.2 Validação de Campos Obrigatórios
![Erro de Validação](./screenshots/error-validation.png)

## 4. Interface do Swagger

### 4.1 Página Principal do Swagger
![Swagger UI](./screenshots/swagger-main.png)

### 4.2 Documentação de Endpoints no Swagger
![Swagger Endpoints](./screenshots/swagger-endpoints.png)

## 5. Testes Unitários

### 5.1 Execução dos Testes
![Execução de Testes](./screenshots/tests-execution.png)

### 5.2 Cobertura de Testes
![Cobertura de Testes](./screenshots/tests-coverage.png)

---

## Instruções para Reproduzir os Testes

1. Importe a coleção do Postman (`supermarket-api.postman_collection.json`)
2. Configure o ambiente do Postman (`supermarket-api.postman_environment.json`)
3. Execute as requisições na ordem apresentada acima
4. Para testes unitários, execute:
   ```bash
   npm test
   npm run test:coverage
   ```
5. Para acessar a documentação Swagger:
   - Inicie o servidor: `npm run dev`
   - Acesse: http://localhost:3333/api-docs
