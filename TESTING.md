# Guia de Testes com Jest

Este documento descreve como configurar, rodar e escrever testes automatizados para o backend do projeto EducaMais.

### Estratégia de Testes

O projeto utiliza o **Jest** como framework de testes. A estratégia principal é focada em **testes de unidade**, onde as dependências externas, como o banco de dados, são "mockadas" (simuladas).

Isso é feito através do arquivo `jest.setup.ts`, que utiliza a biblioteca `jest-mock-extended` para criar uma versão falsa do Prisma Client. Isso garante que nossos testes sejam rápidos, previsíveis e não dependam de um banco de dados real para rodar.

### Dependências de Teste

O comando `npm install` no guia principal de instalação já deve instalar tudo o que você precisa. A lista abaixo serve como referência das principais ferramentas utilizadas:

- `jest`, `ts-jest`, `@types/jest`: O trio essencial para rodar testes escritos em TypeScript.
- `supertest`, `@types/supertest`: Biblioteca para fazer requisições HTTP à nossa API, essencial para testar os endpoints (testes de integração).
- `jest-mock-extended`: Ferramenta para criar "mocks" (simulações) de objetos e classes, usada para mockar o Prisma Client.

Se precisar instalar manualmente, o comando é:

Bash

`npm install -D jest @types/jest ts-jest supertest @types/supertest jest-mock-extended`

---

### Como Rodar os Testes

Como nosso ambiente de desenvolvimento principal é o Docker, os testes devem ser executados dentro do contêiner da aplicação para garantir consistência.

1. **Garanta que os contêineres estejam de pé:**Bash
    
    `docker-compose -f docker-compose.local.yml up -d`
    
2. **Execute o comando de teste:**Bash
    
    `docker-compose -f docker-compose.local.yml exec api npm test`
    

### Outros Comandos Úteis

Você pode adicionar flags do Jest ao comando principal para diferentes cenários:

- **Modo "Watch" (rodar os testes automaticamente ao salvar um arquivo):**Bash
    
    `docker-compose -f docker-compose.local.yml exec api npm test -- --watch`
    
- **Verificar Cobertura de Código (Coverage):**Bash
    
    `docker-compose -f docker-compose.local.yml exec api npm test -- --coverage`
    
- **Rodar testes de um arquivo específico:**Bash
    
    `docker-compose -f docker-compose.local.yml exec api npm test -- src/controllers/__tests__/PostController.spec.ts`
    

> Nota: O -- extra no meio dos comandos é necessário para que o npm passe as flags (--watch, --coverage) diretamente para o Jest.
> 

---

### Onde Escrever os Testes

Conforme definido em `jest.config.ts`, os testes devem ser criados dentro de uma pasta `__tests__` com o sufixo `.spec.ts`. A estrutura recomendada é manter a pasta de testes junto ao arquivo que está sendo testado.

**Exemplo:**

`src/
└── controllers/
    ├── __tests__/
    │   └── PostController.spec.ts  <-- Teste do PostController
    └── PostController.ts           <-- Código do PostController`

---
