<script lang="ts">
  import NavbarPage from '@components/navbar-page/NavbarPage.svelte'
  import SendFungible from '@components/send-tokens/SendFungible.svelte'
  import SendTokenForm from '@components/send-tokens/SendTokenForm.svelte'
</script>

<NavbarPage let:isSendingToken let:onSend let:fungibleResources let:accounts>
  <SendTokenForm
    pending={isSendingToken}
    {onSend}
    {accounts}
    let:hasEnoughTokens
    let:selectedResourceAddress
    let:amountToSend
  >
    <SendFungible
      resources={fungibleResources}
      {hasEnoughTokens}
      {selectedResourceAddress}
      {amountToSend}
    />
  </SendTokenForm>
</NavbarPage>
