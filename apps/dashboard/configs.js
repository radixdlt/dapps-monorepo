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
    '@stores': 'src/stores.ts',
    '@utils': 'src/utils/utils.ts',
    '@constants': 'src/constants.ts',
    '@gateway': 'src/gateway.ts',
    '@configs': 'configs.js',
    '@wallet': 'src/wallet',
    '@featureFlags': 'src/feature-flags',
    '@api': 'src/api'
  }
}
