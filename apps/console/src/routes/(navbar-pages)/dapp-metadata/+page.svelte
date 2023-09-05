<script>
  import DappDefinition from '../../../pages/navbar-pages/dapp-definition/DappDefinition.svelte'
  import NavbarPage from '../../../pages/navbar-pages/NavbarPage.svelte'
</script>

<NavbarPage title="Manage dApp Definition" let:accounts>
  <DappDefinition {accounts} />
</NavbarPage>
