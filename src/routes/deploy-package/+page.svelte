<script>
  import DeployPackage from '@components/deploy-package/DeployPackage.svelte'
  import Box from '@components/_base/box/Box.svelte'
  export const prerender = true
</script>

<Box mx="large" transparent>
  <DeployPackage />
</Box>
