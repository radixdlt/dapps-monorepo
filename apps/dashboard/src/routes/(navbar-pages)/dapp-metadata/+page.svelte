<script>
  import DappDefinition from '@components/_navbar-pages/dapp-definition/DappDefinition.svelte'
  import NavbarPage from '@components/_navbar-pages/NavbarPage.svelte'
</script>

<NavbarPage title="Manage dApp Definition" let:accounts>
  <DappDefinition {accounts} />
</NavbarPage>
