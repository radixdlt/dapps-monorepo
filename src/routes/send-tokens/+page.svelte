<script lang="ts">
  import NavbarPage from '@components/navbar-page/NavbarPage.svelte'
  import SendFungible from '@components/send-tokens/SendFungible.svelte'
  import SendTokenForm from '@components/send-tokens/SendTokenForm.svelte'
</script>

<NavbarPage title="Send Tokens" let:accounts>
  <SendTokenForm
    {accounts}
    let:fungibleResources
    let:selectedFromAccount
    let:selectedToAccount
  >
    <SendFungible
      resources={fungibleResources ?? []}
      {selectedFromAccount}
      {selectedToAccount}
    />
  </SendTokenForm>
</NavbarPage>
