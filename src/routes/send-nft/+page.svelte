<script lang="ts">
  import NavbarPage from '@components/_navbar-pages/navbar-page/NavbarPage.svelte'
  import SendNonFungibleTokens from '@components/_navbar-pages/send-tokens/SendNonFungibleTokens.svelte'
</script>

<NavbarPage title="Send Tokens" let:accounts>
  <SendNonFungibleTokens {accounts} />
</NavbarPage>
