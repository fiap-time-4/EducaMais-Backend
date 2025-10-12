# EducaMais-Backend

Repositório oficial do back-end para o projeto EducaMais, uma plataforma de blogging para docentes e alunos.

## Arquitetura e Tecnologias

A aplicação segue uma arquitetura em camadas para garantir a separação de responsabilidades, manutenibilidade e escalabilidade.

- **Rotas (Routes):** Camada de entrada da API, responsável por definir os endpoints HTTP e direcionar as requisições para os controllers apropriados.
- **Controllers:** Orquestram o fluxo da requisição. Recebem os dados, chamam as validações e interagem com a camada de repositório para manipular os dados.
- **Repositórios (Repositories):** Camada de abstração do acesso ao banco de dados. Centraliza toda a lógica de queries (usando Prisma) e isola o resto da aplicação dos detalhes de implementação da persistência.
- **Validação (Validation):** Funções e tipos dedicados a validar os dados de entrada (`body`, `params`, `query`) para garantir a integridade antes de processar a requisição.

### Tecnologias Utilizadas

| Tecnologia | Propósito |
| --- | --- |
| **Node.js** | Ambiente de execução do back-end. |
| **TypeScript** | Superset do JavaScript que adiciona tipagem estática. |
| **Express** | Framework para gerenciamento de rotas e middlewares. |
| **Prisma** | ORM para interação com o banco de dados e gerenciamento de schema. |
| **PostgreSQL** | Banco de dados relacional para persistência dos dados. |
| **Docker** | Plataforma de containerização para garantir consistência entre ambientes. |
| **Jest** | Framework para a escrita e execução de testes automatizados. |

## Pré-requisitos

Antes de começar, garanta que você tenha as seguintes ferramentas instaladas e configuradas em sua máquina.

| Ferramenta | Versão Recomendada | Link de Instalação |
| --- | --- | --- |
| Git | - | [git-scm.com](https://git-scm.com/downloads) |
| Node.js | LTS (v20+) | [nodejs.org](https://nodejs.org/) |
| Docker Desktop | - | [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop) |

### ⚠️ **Configuração Essencial para Ambiente Windows**

Se você utiliza o Windows, é muito provável que o PowerShell tenha uma política de segurança que impede a execução de scripts, o que pode bloquear comandos do `yarn`. Para corrigir isso preventivamente, siga os passos:

1. Abra o **PowerShell como Administrador**.
2. Execute o seguinte comando:PowerShell
    
    `Set-ExecutionPolicy RemoteSigned`
    
3. Quando for solicitado, pressione `S` para confirmar a alteração.

Isso permitirá que os scripts necessários para o desenvolvimento rodem sem problemas.

---

## Guia de Instalação e Execução

Siga este passo a passo para configurar e rodar a aplicação localmente.

### 1. Clonar o Repositório

`git clone https://github.com/fiap-time-4/EducaMais-Backend.git`

### 2. Acessar a Pasta do Projeto

`cd EducaMais-Backend`

### 3. Configurar Variáveis de Ambiente

    O projeto precisa de um arquivo `.env` para carregar informações sensíveis, como as credenciais do banco de dados.

1. Crie uma cópia do arquivo `.env.example` e renomeie-a para `.env`.

### 4. Instalar as Dependências do Projeto

    Este comando irá baixar todas as bibliotecas que a aplicação precisa (Prisma, Express, etc.).

    `npm install`

### 5. Subir os Contêineres com Docker

Este comando irá construir e iniciar os contêineres da API e do banco de dados.

1. **Certifique-se de que o Docker Desktop está aberto e com o status "Running" (verde) antes de continuar.**
2. Execute o comando abaixo no seu terminal
    
    `docker compose -f docker-compose.local.yml up --build -d`
    
    *A flag `-d` executa os contêineres em segundo plano (detached mode).*
    
O servidor da API estará acessível em `http://localhost:3333`.

---

## Fluxo de Trabalho de Desenvolvimento

Todos os comandos de desenvolvimento (como rodar migrations, testes ou instalar pacotes) devem ser executados **dentro do contêiner da API** para garantir consistência. Isso é feito usando o comando `docker-compose exec api ...`.

### **Rodando Migrations do Banco de Dados**

Sempre que você alterar o arquivo `prisma/schema.prisma`, execute o seguinte comando para gerar e aplicar uma nova migration no banco de dados que está rodando no Docker.

`docker-compose -f docker-compose.local.yml exec api npx prisma migrate dev --name <nome-da-migration>`

### **Instalando Novas Dependências**

Para adicionar uma nova biblioteca ao projeto, execute o comando `npm install` dentro do contêiner. Isso garante que a dependência seja instalada no ambiente correto (Linux).

### Para dependências de produção
`docker-compose -f docker-compose.local.yml exec api npm install <nome-da-biblioteca>`

### Para dependências de desenvolvimento
`docker-compose -f docker-compose.local.yml exec api npm install <nome-da-biblioteca> --save-dev`

Após instalar, talvez seja necessário reiniciar o contêiner para que o servidor reconheça a nova biblioteca:

`docker-compose -f docker-compose.local.yml restart api`

### **Rodando os Testes Automatizados**

Para executar a suíte de testes com Jest, utilize o comando:

`docker-compose -f docker-compose.local.yml exec api npm test`

Isso irá rodar todos os arquivos `.spec.ts` e exibir o relatório de cobertura de testes no final.

---

## Endpoints da API

A API foi projetada para gerenciar as postagens de um blog, permitindo operações de criação, leitura, atualização e exclusão (CRUD), com um sistema de autenticação para proteger as rotas de modificação de dados.

### Fluxo de Uso Recomendado

Devido à relação entre Usuários e Posts, um `Post` não pode existir sem um `User` associado. Portanto, o fluxo correto para utilizar a API é:

1. **Criar um Usuário:** Use o endpoint `POST /users` para criar um ou mais usuários. Guarde o `id` retornado.
2. **Criar um Post:** Use o `id` de um usuário existente no campo `autorId` ao chamar o endpoint `POST /posts`.

---

### 👤 Usuários

Endpoints para o gerenciamento de usuários.

### 1. Criar um novo Usuário

Cria um novo usuário no sistema. Este passo é **necessário** antes de criar posts.

- **Método:** `POST`
- **Endpoint:** `/users`

### Corpo da Requisição (Body)

JSON

`{

  "email": "usuario@exemplo.com",

  "name": "Nome do Usuário"

}`

- `email` (obrigatório): Deve ser um email único.
- `name` (opcional): Nome do usuário.

### ✅ Resposta de Sucesso (201 Created)

JSON

`{

    "message": "Usuário criado com sucesso!",

    "user": {

        "id": 1,

        "email": "usuario@exemplo.com",

        "name": "Nome do Usuário",

        "createdAt": "2025-10-07T23:55:00.000Z",

        "updatedAt": "2025-10-07T23:55:00.000Z"

    }

}`

---

### 📝 Posts

Endpoints para o gerenciamento de posts.

### 1. Criar um novo Post

Cria um novo post, associando-o a um usuário existente através do `autorId`.

- **Método:** `POST`
- **Endpoint:** `/posts`

### Corpo da Requisição (Body)

JSON

`{

  "titulo": "Primeiro Post",

  "conteudo": "Este é o conteúdo do primeiro post.",

  "autorId": 1

}`


- `autorId` (obrigatório): Deve ser o `id` de um usuário que já existe no banco de dados.

### ✅ Resposta de Sucesso (201 Created)

A resposta já inclui o objeto completo do autor.

JSON

`{

    "success": true,

    "message": "Post criado com sucesso",

    "data": {

        "id": 1,

        "titulo": "Primeiro Post",

        "conteudo": "Este é o conteúdo do primeiro post.",

        "autorId": 1,

        "createdAt": "2025-10-07T23:45:00.000Z",

        "atualizacao": "2025-10-07T23:45:00.000Z",

        "autor": {

            "id": 1,

            "email": "usuario@exemplo.com",

            "name": "Nome do Usuário"

        }

    }

}`


### ❌ Respostas de Erro

**Status `400 Bad Request`**

Ocorre quando os dados enviados pelo cliente são inválidos. Existem duas situações principais:

1. **Falha na Validação dos Campos:** Um campo obrigatório não foi enviado ou não segue as regras (ex: título vazio, conteúdo muito curto).

JSON
    
    `{

        "success": false,

        "message": "Título é obrigatório"

    }`    
    
    *Outros exemplos de mensagem: "Conteúdo deve ter pelo menos 10 caracteres", "ID do autor é obrigatório e deve ser um número válido".*
    
2. **`autorId` Inexistente:** O `autorId` enviado é um número válido, mas não corresponde a nenhum usuário cadastrado no banco de dados.
    
JSON

    `{\
        "success": false,\
        "message": "O autorId fornecido não corresponde a um usuário existente."\
    }`\
    

**Status `500 Internal Server Error`**

Ocorre quando há uma falha inesperada no servidor que impede a criação do post (ex: o banco de dados está offline).

JSON

`{\
    "success": false,\
    "message": "Não foi possível criar o post."\
}`\

---

### 2. Listar todos os Posts

Retorna uma lista paginada de todos os posts, incluindo os dados do autor de cada um.

- **Método:** `GET`
- **Endpoint:** `/posts`

### Query Parameters

- `page` (opcional): Número da página. *Default: 1*.
- `limit` (opcional): Quantidade de posts por página. *Default: 10*.

**Exemplo:** `GET /posts?page=2&limit=5`

### Resposta de Sucesso (200 OK)

JSON

`{

    "success": true,

    "data": [

        {

            "id": 1,

            "titulo": "Primeiro Post",

            "conteudo": "Este é o conteúdo do primeiro post.",

            "autorId": 1,

            "createdAt": "2025-10-07T23:45:00.000Z",

            "atualizacao": "2025-10-07T23:45:00.000Z",

            "autor": {

                "id": 1,

                "email": "usuario@exemplo.com",

                "name": "Nome do Usuário"

            }

        }

    ],

    "pagination": {

        "page": 1,

        "limit": 10,

        "total": 1,

        "pages": 1

    }

}`


---

### 3. Buscar Post por ID

Busca um post específico pelo seu ID.

- **Método:** `GET`
- **Endpoint:** `/posts/id`

### ✅ Resposta de Sucesso (200 OK)

JSON

`{

    "success": true,

    "data": {

        "id": 1,

        "titulo": "Primeiro Post",

        "conteudo": "Este é o conteúdo do primeiro post.",

        "autorId": 1,

        "createdAt": "2025-10-07T23:45:00.000Z",

        "atualizacao": "2025-10-07T23:45:00.000Z",

        "autor": {

            "id": 1,

            "email": "usuario@exemplo.com",

            "name": "Nome do Usuário"

        }

    }

}`


### ❌ Resposta de Erro (404 Not Found)

JSON

`{

    "success": false,

    "message": "Post não encontrado"

}`


---

### 4. Atualizar um Post

Atualiza os dados de um post existente. O autor do post (`autorId`) não pode ser alterado.

- **Método:** `PUT`
- **Endpoint:** `/posts/id`

### Corpo da Requisição (Body)

Apenas os campos a serem atualizados são necessários.

JSON

`{

  "titulo": "Título Atualizado",

  "conteudo": "Conteúdo novo e revisado."

}`


### ✅ Resposta de Sucesso (200 OK)

JSON

`{

    "success": true,

    "message": "Post atualizado com sucesso",

    "data": {

        "id": 1,

        "titulo": "Título Atualizado",

        "conteudo": "Conteúdo novo e revisado.",

        "autorId": 1,

        "createdAt": "2025-10-07T23:45:00.000Z",

        "atualizacao": "2025-10-07T23:58:00.000Z",

        "autor": {

            "id": 1,

            "email": "usuario@exemplo.com",

            "name": "Nome do Usuário"

        }

    }

}`


---

### 5. Deletar um Post

Deleta um post do banco de dados.

- **Método:** `DELETE`
- **Endpoint:** `/posts/id`

### Resposta de Sucesso (200 OK)

JSON

`{

    "success": true,

    "message": "Post deletado com sucesso"

}`


---

### 6. Buscar Posts por Termo

Busca posts que contenham o termo pesquisado no título ou no conteúdo.

- **Método:** `GET`
- **Endpoint:** `/posts/search`

Exemplo: `http://localhost:3333/posts/search?search=primeiro`

### Query Parameters

- `search` (obrigatório): O termo a ser buscado.
- `page` e `limit` (opcionais).

Exemplo: `http://localhost:3333/posts/search?search=primeiro&page=1&limit=5`

### ✅ Resposta de Sucesso (200 OK)

A estrutura da resposta é idêntica à da listagem de todos os posts, com paginação.

JSON

`{
    
    "success": true,
    
    "data": [
        
        {
            
            "id": 1,
            
            "titulo": "Primeiro Comunicado",
            
            "conteudo": "Este é o conteúdo do primeiro post.",
            
            "autorId": 1,
            
            "createdAt": "...",
            
            "atualizacao": "...",
            
            "autor": {
                
                "id": 1,
                
                "email": "usuario@exemplo.com",
                
                "name": "Nome do Usuário"
                
            }
            
        }
        
    ],
    
    "pagination": {
        
        "page": 1,
        
        "limit": 5,
        
        "total": 1,
        
        "pages": 1
        
    }
    
}`


---

O desenvolvimento deste projeto foi uma jornada de aprendizado contínuo, marcada pela colaboração entre membros com diferentes níveis de experiência. Nosso principal desafio foi a gestão de tempo e a distribuição de tarefas, garantindo que todos pudessem contribuir de forma significativa.

Alguns dos desafios específicos que a equipe enfrentou foram:

- **Curva de Aprendizagem:** A equipe optou por utilizar tecnologias novas para a maioria, como **Docker**, **Prisma** e **TypeScript**. Isso exigiu tempo para pesquisa e adaptação.
- **Colaboração em Equipe:** O trabalho em grupo foi essencial para superar as dificuldades. Desenvolvedores mais experientes atuaram como mentores, prestando suporte e revisando o código. Essa dinâmica de organização e compartilhamento de conhecimento se mostrou crucial para a entrega do projeto.
- **Tomada de Decisão:** A escolha do **PostgreSQL** como banco de dados foi unânime. A decisão final por um banco relacional se baseou na familiaridade e na sua capacidade de lidar com a estrutura de dados do projeto, que é relativamente simples.
- **Integração de Tecnologias:** A integração de diferentes ferramentas, como **Express**, **Prisma** e **Docker**, exigiu atenção aos detalhes de configuração para que todos os serviços funcionassem de forma coesa.

Apesar dos desafios, a experiência foi extremamente enriquecedora. A equipe não apenas entregou a aplicação, mas também desenvolveu habilidades em novas tecnologias.