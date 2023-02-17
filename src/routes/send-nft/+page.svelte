<script lang="ts">
  import NavbarPage from '@components/_navbar-pages/navbar-page/NavbarPage.svelte'
  import SendNonFungible from '@components/_navbar-pages/send-tokens/SendNonFungible.svelte'
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
    <SendNonFungible
      {selectedFromAccount}
      {selectedToAccount}
      resources={resources?.nonFungible || []}
      {setTransactionManifest}
      {setResourceSelected}
    />
  </SendTokenForm>
</NavbarPage>
