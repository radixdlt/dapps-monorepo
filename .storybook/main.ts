const { mergeConfig } = require('vite')

const aliasWithSlash = (alias) =>
  Object.entries(alias).reduce(
    (obj, [key, value]) => ({
      ...obj,
      [key]: `/${value}`
    }),
    {}
  )

module.exports = {
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-svelte-csf',
    '@storybook/addon-actions'
  ],
  framework: '@storybook/svelte',
  core: {
    builder: '@storybook/builder-vite'
  },
  staticDirs: ['../static'],
  async viteFinal(config, { configType }) {
    // return the customized config
    return mergeConfig(config, {
      // customize the Vite config here
      resolve: {
        alias: {
          ...aliasWithSlash((await import('../configs.js')).configs.alias),
          '$env/static/public': '.storybook/mocks.ts'
        }
      }
    })
  }
}
