<script lang="ts">
  import NavbarPage from '../../../pages/navbar-pages/NavbarPage.svelte'
  import SendNonFungibleTokens from '../../../pages/navbar-pages/send-tokens/SendNonFungibleTokens.svelte'
</script>

<NavbarPage title="Send NFTs" let:accounts>
  <SendNonFungibleTokens {accounts} />
</NavbarPage>
