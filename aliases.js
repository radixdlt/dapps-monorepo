module.exports.aliases = () => {
  const root = `${process.cwd()}/../../`

  const uiRoot = `${root}/packages/ui`
  const commonRoot = `${root}/packages/common`
  const dashboardRoot = `${root}/apps/dashboard`

  return {
    '@components': `${uiRoot}/src/components`,
    '@styles': `${uiRoot}/src/styles.ts`,
    '@utils': `${uiRoot}/src/utils`,
    '@directives': `${uiRoot}/src/directives`,
    '@api': `${uiRoot}/src/api`,
    '@common': `${commonRoot}/src`,
    '@constants': `${uiRoot}/src/constants`,
    '@stores': `${uiRoot}/src/stores`,
    '@icons': `${uiRoot}/static/icons`,
    '@images': `${uiRoot}/static/images`,
    '@fonts': `${uiRoot}/src/fonts.css`,
    '@networks': `${uiRoot}/src/network`,

    '@dashboard-pages': `${dashboardRoot}/src/pages`,
    '@featureFlags': `${dashboardRoot}/src/feature-flags`
  }
}
