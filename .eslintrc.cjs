module.exports = {
  plugins: ['unused-imports'],
  extends: ['@sveltejs', 'plugin:storybook/recommended', 'prettier'],
  rules: {
    semi: [0, 'never'],
    'unused-imports/no-unused-imports': 'error',
    'import/namespace': ['error', { allowComputed: true }],
    'jsx-a11y/click-events-have-key-events': 'off'
  },
  settings: {
    'svelte3/typescript': require('typescript')
  }
};

