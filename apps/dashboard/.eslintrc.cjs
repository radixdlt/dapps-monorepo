module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['unused-imports', 'svelte3', '@typescript-eslint'],
  extends: ['plugin:storybook/recommended', 'prettier'],
  overrides: [
    {
      files: ["*.svelte"],
      processor: 'svelte3/svelte3'
    },
  ],
  settings: {
    'svelte3/typescript': () => require('typescript')
  }
};

