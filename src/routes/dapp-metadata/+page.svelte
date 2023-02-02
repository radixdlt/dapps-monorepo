<script>
  import DappMetadata from '@components/_navbar-pages/dapp-metadata/DappMetadata.svelte'
  import NavbarPage from '@components/_navbar-pages/navbar-page/NavbarPage.svelte'
</script>

<NavbarPage title="Manage dApp Definition" let:accounts>
  <DappMetadata {accounts} />
</NavbarPage>
