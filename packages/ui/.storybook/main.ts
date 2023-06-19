import { mergeConfig, searchForWorkspaceRoot } from 'vite'

export default {
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx|svelte)',
    '../../../apps/**/src/**/*.stories.@(js|jsx|ts|tsx|svelte)'
  ],
  addons: [
    'storybook-addon-mock',
    '@storybook/addon-links',
    '@storybook/addon-svelte-csf',
    '@storybook/addon-essentials',
    '@storybook/addon-actions',
    '@storybook/addon-interactions',
    '@storybook/addon-coverage',
    '@storybook/addon-mdx-gfm'
  ],
  framework: {
    name: '@storybook/sveltekit',
    options: {}
  },
  staticDirs: ['../static'],
  docs: {
    autodocs: true
  },
  core: {
    builder: '@storybook/builder-vite'
  },
  async viteFinal(config) {
    // Merge custom configuration into the default config
    return mergeConfig(config, {
      // Add dependencies to pre-optimization
      server: {
        fs: {
          allow: [searchForWorkspaceRoot(process.cwd()), '../static']
        }
      }
    })
  }
}
