<script lang="ts">
  import NavbarPage from '../../../pages/_navbar-pages/NavbarPage.svelte'
  import SendNonFungibleTokens from '../../../pages/_navbar-pages/send-tokens/SendNonFungibleTokens.svelte'
</script>

<NavbarPage title="Send NFTs" let:accounts>
  <SendNonFungibleTokens {accounts} />
</NavbarPage>
