<script lang="ts">
  import NavbarPage from '../../../pages/navbar-pages/NavbarPage.svelte'
  import SendFungibleTokens from '../../../pages/navbar-pages/send-tokens/SendFungibleTokens.svelte'
</script>

<NavbarPage title="Send Tokens" let:accounts>
  <SendFungibleTokens {accounts} />
</NavbarPage>
