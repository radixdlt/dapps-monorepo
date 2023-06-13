<script>
  import DappDefinition from '../../../pages/_navbar-pages/dapp-definition/DappDefinition.svelte'
  import NavbarPage from '../../../pages/_navbar-pages/NavbarPage.svelte'
</script>

<NavbarPage title="Manage dApp Definition" let:accounts>
  <DappDefinition {accounts} />
</NavbarPage>
