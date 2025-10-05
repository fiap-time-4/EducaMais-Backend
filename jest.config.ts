/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.spec.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  roots: ["<rootDir>"],
  moduleNameMapper: {
    "^(../.*)$": "$1",
    "^(./.*)$": "$1",
  },
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/db/**"],
  coverageDirectory: "coverage",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
