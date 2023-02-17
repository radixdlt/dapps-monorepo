<script lang="ts">
  import NavbarPage from '@components/_navbar-pages/navbar-page/NavbarPage.svelte'
  import SendFungible from '@components/_navbar-pages/send-tokens/SendFungible.svelte'
  import SendTokenForm from '@components/_navbar-pages/send-tokens/SendTokens.svelte'
</script>

<NavbarPage title="Send Tokens" let:accounts>
  <SendTokenForm
    {accounts}
    let:resources
    let:selectedFromAccount
    let:selectedToAccount
    let:setResourceSelected
    let:setTransactionManifest
  >
    <SendFungible
      {selectedFromAccount}
      {selectedToAccount}
      resources={resources?.fungible || []}
      {setTransactionManifest}
      {setResourceSelected}
    />
  </SendTokenForm>
</NavbarPage>
