module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: 'standard-with-typescript',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json' // Aponta para seu arquivo de config do TypeScript
  },
  rules: {
    // Adicione aqui regras personalizadas se desejar
  }
}