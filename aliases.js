module.exports.aliases = () => {
  const root = `${process.cwd()}/../../`

  const svelteUiRoot = `${root}/packages/svelte-ui`
  const commonRoot = `${root}/packages/common`
  const dashboardRoot = `${root}/apps/dashboard`

  return {
    '@svelte-ui': `${svelteUiRoot}/src/lib`,
    '@common': `${commonRoot}/src`,
    '@icons': `${commonRoot}/src/static/icons`,
    '@images': `${commonRoot}/src/static/images`,
    '@dashboard': `${dashboardRoot}/src`,
    '@dashboard-pages': `${dashboardRoot}/src/pages`
  }
}
