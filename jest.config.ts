/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  // O preset já configura o transformador para TypeScript
  preset: "ts-jest",
  
  // Define o ambiente de execução para Node.js
  testEnvironment: "node",

  // Onde encontrar os arquivos de teste
  testMatch: ["**/__tests__/**/*.spec.ts"],

  // Limpa os mocks entre os testes
  clearMocks: true,

  // Habilita a coleta de cobertura
  collectCoverage: true,

  // Define de quais arquivos a cobertura deve ser coletada
  collectCoverageFrom: [
    "src/**/*.ts",
    // Exclusões:
    "!src/server.ts",
    "!src/jest.setup.ts",
    "!src/util/prisma.ts",
    "!src/routes/**",
    "!src/**/*.d.ts",
  ],

  // O diretório onde o relatório será salvo
  coverageDirectory: "coverage",

  // O arquivo de setup a ser executado antes dos testes
  setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts"],
};