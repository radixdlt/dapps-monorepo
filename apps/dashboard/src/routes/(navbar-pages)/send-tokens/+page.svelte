<script lang="ts">
  import NavbarPage from '../../../pages/_navbar-pages/NavbarPage.svelte'
  import SendFungibleTokens from '../../../pages/_navbar-pages/send-tokens/SendFungibleTokens.svelte'
</script>

<NavbarPage title="Send Tokens" let:accounts>
  <SendFungibleTokens {accounts} />
</NavbarPage>
