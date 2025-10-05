// eslint.config.js

import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  // Configuração padrão recomendada pelo typescript-eslint
  ...tseslint.configs.recommended,
  
  // Configuração para regras de estilo (formatação)
  ...tseslint.configs.stylistic,

  // Configuração customizada do nosso projeto
  {
    ignores: ['node_modules', 'dist', 'coverage', 'eslint.config.js'], // Pastas a serem ignoradas
    
    languageOptions: {
      globals: {
        ...globals.node // Habilita as variáveis globais do ambiente Node.js
      },
      parserOptions: {
        project: true, // Usa o tsconfig.json mais próximo
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      // Regras de estilo podem ser muito rígidas.
      // Aqui desabilitamos uma que exige tipo de retorno em toda função.
      '@typescript-eslint/explicit-function-return-type': 'off',
      // Você pode adicionar ou modificar outras regras aqui conforme a necessidade.
    }
  }
);