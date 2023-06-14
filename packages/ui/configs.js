export const configs = {
  flags: {
    isVitebook: process.env.VITEBOOK === 'true'
  },
  alias: {
    '@components': 'src/components',
    '@styles': 'src/styles.ts',
    '@utils': 'src/utils',
    '@configs': 'configs.js',
    '@directives': 'src/directives',
    '@api': 'src/api',
    '@constants': 'src/constants',
    '@stores': 'src/stores',
    '@icons': 'static/icons'
  }
}
