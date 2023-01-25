<script lang="ts">
  import NavbarPage from '@components/navbar-page/NavbarPage.svelte'
  import SendTokenForm from '@components/send-tokens/SendTokenForm.svelte'
</script>

<NavbarPage title="Send NFTs" let:accounts>
  <SendTokenForm tokenType="nonFungible" {accounts} />
</NavbarPage>
