export const configs = {
  flags: {
    isVitebook: process.env.VITEBOOK === 'true'
  },
  alias: {
    '@components': '../../packages/ui/src/components',
    '@pages': 'src/pages',
    '@styles': '../../packages/ui/src/styles.ts',
    '@directives': '../../packages/ui/src/directives',
    '@types': 'src/types.ts',
    '@sdk': 'src/mock-sdk.ts',
    '@gateway': 'src/gateway.ts',
    '@configs': 'configs.js',
    '@wallet': 'src/wallet',
    '@api': 'src/api',
    '@featureFlags': 'src/feature-flags',
    '@stores': '../../packages/ui/src/stores.ts',
    '@utils': '../../packages/ui/src/utils',
    '@networks': '../../packages/ui/src/network.ts',
    '@constants': '../../packages/ui/src/constants.ts',
    '@images': '../../packages/ui/static/images',
    '@icons': '../../packages/ui/static/icons',
    '@fonts': '../../packages/ui/src/fonts.css'
  }
}
