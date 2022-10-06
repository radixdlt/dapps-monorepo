module.exports = {
  plugins: ['unused-imports'],
  extends: ['@sveltejs', 'plugin:storybook/recommended'],
  rules: {
    semi: [0, 'never'],
    'unused-imports/no-unused-imports': 'error'
  },
  settings: {
    'svelte3/typescript': require('typescript')
  }
};

