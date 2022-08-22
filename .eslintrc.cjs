module.exports = {
  extends: ['@sveltejs', 'plugin:storybook/recommended'],
  rules: {
    semi: [0, 'never']
  },
  settings: {
    'svelte3/typescript': require('typescript')
  }
};