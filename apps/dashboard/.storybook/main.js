module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
  addons: ['storybook-addon-mock', '@storybook/addon-links', '@storybook/addon-svelte-csf', '@storybook/addon-essentials', '@storybook/addon-actions', '@storybook/addon-interactions', '@storybook/addon-coverage', '@storybook/addon-mdx-gfm'],
  framework: {
    name: '@storybook/sveltekit',
    options: {}
  },
  staticDirs: ['../static'],
  docs: {
    autodocs: true
  }
};