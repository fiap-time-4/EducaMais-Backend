# EducaMais-Backend

Repositório oficial do back-end para o projeto EducaMais, uma plataforma de blogging para docentes e alunos.

## Arquitetura e Tecnologias

A aplicação segue uma arquitetura em camadas para garantir a separação de responsabilidades, manutenibilidade e escalabilidade.

- **Rotas (Routes):** Camada de entrada da API, responsável por definir os endpoints HTTP e direcionar as requisições para os controllers apropriados.
- **Middlewares:** Funções que interceptam requisições para tratar de tarefas transversais, como autenticação (verificação de token JWT) e tratamento de erros.
- **Controllers:** Orquestram o fluxo da requisição. Recebem os dados, chamam as validações e interagem com a camada de repositório para manipular os dados.
- **Repositórios (Repositories):** Camada de abstração do acesso ao banco de dados. Centraliza toda a lógica de queries (usando Prisma) e isola o resto da aplicação dos detalhes de implementação da persistência.
- **Validação (Validation):** Funções e tipos dedicados a validar os dados de entrada (`body`, `params`, `query`) para garantir a integridade antes de processar a requisição.

## Tecnologias Utilizadas

| Tecnologia     | Propósito                                                                        |
| -------------- | -------------------------------------------------------------------------------- |
| Node.js        | Ambiente de execução do back-end.                                                |
| TypeScript     | Superset do JavaScript que adiciona tipagem estática.                            |
| Express        | Framework para gerenciamento de rotas e middlewares.                             |
| Prisma         | ORM para interação com o banco de dados e gerenciamento de schema.               |
| PostgreSQL     | Banco de dados relacional para persistência dos dados.                           |
| Docker         | Plataforma de containerização para garantir consistência entre ambientes.        |
| Jest           | Framework para a escrita e execução de testes automatizados.                     |
| ESLint         | Ferramenta para padronização e análise estática da qualidade do código.          |
| JWT & BcryptJS | Bibliotecas para implementação de autenticação segura (tokens e hash de senhas). |

## Pré-requisitos

Antes de começar, garanta que você tenha as seguintes ferramentas instaladas e configuradas em sua máquina.

| Ferramenta     | Versão Recomendada | Link de Instalação                                                                   |
| -------------- | ------------------ | ------------------------------------------------------------------------------------ |
| Git            | -                  | [git-scm.com](https://git-scm.com)                                                   |
| Node.js        | LTS (v20+)         | [nodejs.org](https://nodejs.org)                                                     |
| Yarn           | v1 (Classic)       | [classic.yarnpkg.com](https://classic.yarnpkg.com)                                   |
| Docker Desktop | -                  | [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop) |

## ⚠️ Configuração Essencial para Ambiente Windows

Se você utiliza o Windows, é muito provável que o PowerShell tenha uma política de segurança que impede a execução de scripts, o que pode bloquear comandos do `npm` e `yarn`. Para corrigir isso preventivamente, siga os passos:

1.  Abra o PowerShell como **Administrador**.
2.  Execute o seguinte comando:
    `Set-ExecutionPolicy RemoteSigned `
3.  Quando for solicitado, pressione `S` para confirmar a alteração.

Isso permitirá que os scripts necessários para o desenvolvimento rodem sem problemas.

## Guia de Instalação e Execução

Siga este passo a passo para configurar e rodar a aplicação localmente.

### 1. Clonar o Repositório

`git clone <URL_DO_SEU_REPOSITORIO>`

2. Acessar a Pasta do Projeto
   `cd EducaMais-Backend`

3. Configurar Variáveis de Ambiente
   O projeto precisa de um arquivo .env para carregar informações sensíveis, como as credenciais do banco de dados.

Crie uma cópia do arquivo .env.example e renomeie-a para .env.

4. Instalar as Dependências do Projeto
   Este comando irá baixar todas as bibliotecas que a aplicação precisa (Prisma, Express, etc.).

`yarn install`

5. Subir os Contêineres com Docker
   Este comando irá construir e iniciar os contêineres da API e do banco de dados.

Certifique-se de que o Docker Desktop está aberto e com o status "Running" (verde) antes de continuar.

Execute o comando abaixo no seu terminal:

`docker compose -f docker-compose.local.yml up --build -d`

A flag -d executa os contêineres em segundo plano (detached mode).
O servidor da API estará acessível em http://localhost:3333.

## Fluxo de Trabalho de Desenvolvimento

### Rodando Migrations do Banco de Dados

Sempre que houver uma alteração no arquivo prisma/schema.prisma, uma nova migration precisa ser gerada para atualizar a estrutura do banco de dados.

Certifique-se de que seus contêineres estão rodando (docker compose ... up).

Execute o comando de migration:

`yarn prisma migrate dev --name <nome-descritivo-da-migration>`
Exemplo: `yarn prisma migrate dev --name create_posts_table`

### Instalando Novas Dependências

Para adicionar uma nova biblioteca, siga os passos:

Pare os contêineres: `docker compose -f docker-compose.local.yml down`

Instale a dependência com Yarn:

Produção: `yarn add nome-da-biblioteca`

Desenvolvimento: `yarn add nome-da-biblioteca --dev`

Suba os contêineres novamente com o comando de up, que irá reconstruir a imagem com a nova dependência.

## Endpoints da API

A API foi projetada para gerenciar as postagens de um blog, permitindo operações de criação, leitura, atualização e exclusão (CRUD), com um sistema de autenticação para proteger as rotas de modificação de dados.

### Autenticação

POST `/auth/login`
Descrição: Autentica um usuário (docente) com base em email e senha e retorna um token de acesso JWT.

Acesso: Público

Corpo da Requisição (Body):

JSON

{
"email": "professor@exemplo.com",
"password": "123456"
}

Resposta de Sucesso (200 OK):

JSON

{
"success": true,
"message": "Login realizado com sucesso.",
"data": {
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJwcm9mZXNzb3JAZXhlbXBsby5jb20iLCJpYXQiOjE3MjkzNzE2ODQsImV4cCI6MTcyOTQwMDQ4NH0.abcdef123456"
}
}

## Posts
``GET /posts``
Descrição: Retorna uma lista paginada de todos os posts.

Acesso: Público

Query Params (Opcionais):

page: Número da página a ser exibida. (Padrão: 1)

limit: Quantidade de itens por página. (Padrão: 10)

Resposta de Sucesso (200 OK):

JSON

{
"success": true,
"data": [
{
"id": 1,
"titulo": "Introdução à Programação",
"conteudo": "Aprenda os conceitos básicos...",
"createdAt": "2025-10-05T14:00:00.000Z",
"atualizacao": "2025-10-05T14:00:00.000Z",
"authorId": 1,
"author": {
"id": 1,
"name": "Prof. Ana",
"email": "ana@exemplo.com"
}
}
],
"pagination": {
"page": 1,
"limit": 10,
"total": 1,
"pages": 1
}
}

**GET /posts/:id**\
Descrição: Retorna os detalhes de um único post pelo seu ID.\
Acesso: Público\
Parâmetros de URL:\
id: O ID numérico do post.\
Resposta de Sucesso (200 OK):\

JSON

{
"success": true,
"data": {
"id": 1,
"titulo": "Introdução à Programação",
"conteudo": "Aprenda os conceitos básicos...",
"createdAt": "2025-10-05T14:00:00.000Z",
"atualizacao": "2025-10-05T14:00:00.000Z",
"authorId": 1,
"author": {
"id": 1,
"name": "Prof. Ana",
"email": "ana@exemplo.com"
}
}
}

**POST /posts**
Descrição: Cria um novo post. O autor é definido automaticamente com base no usuário autenticado.\
Acesso: Protegido\
Headers: Authorization: Bearer <seu_token_jwt>\

Corpo da Requisição (Body):

JSON

{
"titulo": "O que é TypeScript?",
"conteudo": "Uma introdução completa sobre o TypeScript e suas vantagens."
}
Resposta de Sucesso (201 Created):

JSON

{
"success": true,
"message": "Post criado com sucesso",
"data": {
"id": 3,
"titulo": "O que é TypeScript?",
"conteudo": "Uma introdução completa sobre o TypeScript e suas vantagens.",
"authorId": 2,
"createdAt": "2025-10-05T15:30:00.000Z",
"atualizacao": "2025-10-05T15:30:00.000Z"
}
}
PUT /posts/:id
Descrição: Atualiza um post existente. Apenas titulo e conteudo podem ser alterados.

Acesso: Protegido

Parâmetros de URL: id: O ID numérico do post a ser atualizado.

Headers: Authorization: Bearer <seu_token_jwt>
