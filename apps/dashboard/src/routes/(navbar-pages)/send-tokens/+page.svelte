<script lang="ts">
  import NavbarPage from '@components/_navbar-pages/NavbarPage.svelte'
  import SendFungibleTokens from '@components/_navbar-pages/send-tokens/SendFungibleTokens.svelte'
</script>

<NavbarPage title="Send Tokens" let:accounts>
  <SendFungibleTokens {accounts} />
</NavbarPage>
