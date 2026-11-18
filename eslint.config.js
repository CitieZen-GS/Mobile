// Configuração do ESLint (flat config): regras do Expo + desliga as regras de estilo que o Prettier já cuida.
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');
const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  {
    ignores: ['dist/*', '.expo/*', 'node_modules/*'],
  },
]);
