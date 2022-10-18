<script>
  import DeployPackage from '@components/deploy-package/DeployPackage.svelte'
  import LoadingPage from '@components/loading-page/LoadingPage.svelte'
  import Box from '@components/_base/box/Box.svelte'
  export const prerender = true
</script>

<LoadingPage>
  <Box mx="large" transparent>
    <DeployPackage />
  </Box>
</LoadingPage>
