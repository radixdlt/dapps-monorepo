<script>
  import DeployPackage from '../../../pages/_navbar-pages/deploy-package/DeployPackage.svelte'
  import NavbarPage from '../../../pages/_navbar-pages/NavbarPage.svelte'
</script>

<NavbarPage title="Deploy Package" let:accounts>
  <DeployPackage {accounts} />
</NavbarPage>
