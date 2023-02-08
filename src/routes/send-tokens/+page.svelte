<script lang="ts">
  import NavbarPage from '@components/_navbar-pages/navbar-page/NavbarPage.svelte'
  import SendTokenForm from '@components/_navbar-pages/send-tokens/SendTokenForm.svelte'
</script>

<NavbarPage title="Send Tokens" let:accounts>
  <SendTokenForm tokenType="fungible" {accounts} />
</NavbarPage>
