<script>
  import DeployPackage from '@components/_navbar-pages/deploy-package/DeployPackage.svelte'
  import NavbarPage from '@components/_navbar-pages/navbar-page/NavbarPage.svelte'
</script>

<NavbarPage title="Deploy Package" let:accounts>
  <DeployPackage {accounts} />
</NavbarPage>
