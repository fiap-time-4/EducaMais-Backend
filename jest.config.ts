/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.spec.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  roots: ["<rootDir>"],
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/db/**", "!src/app.ts", "!src/server.ts"],
  coverageDirectory: "coverage",
  setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts"],
};