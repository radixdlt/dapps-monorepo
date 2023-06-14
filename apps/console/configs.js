export const configs = {
  flags: {
    isVitebook: process.env.VITEBOOK === 'true'
  },
  alias: {
    '@pages': 'src/pages',
    '@configs': 'configs.js',
    '@featureFlags': 'src/feature-flags',
    '@components': '../../packages/ui/src/components',
    '@styles': '../../packages/ui/src/styles.ts',
    '@directives': '../../packages/ui/src/directives',
    '@stores': '../../packages/ui/src/stores.ts',
    '@utils': '../../packages/ui/src/utils',
    '@networks': '../../packages/ui/src/network.ts',
    '@constants': '../../packages/ui/src/constants.ts',
    '@images': '../../packages/ui/static/images',
    '@icons': '../../packages/ui/static/icons',
    '@fonts': '../../packages/ui/src/fonts.css'
  }
}
