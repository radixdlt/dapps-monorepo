<script>
  import DeployPackage from '../../../pages/navbar-pages/deploy-package/DeployPackage.svelte'
  import NavbarPage from '../../../pages/navbar-pages/NavbarPage.svelte'
</script>

<NavbarPage title="Deploy Package" let:accounts>
  <DeployPackage {accounts} />
</NavbarPage>
