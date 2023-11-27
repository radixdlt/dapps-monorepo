<script lang="ts">
  import Fungible from './token-type/Fungible.svelte'
  import SendTokens from './SendTokens.svelte'
</script>

<SendTokens
  let:resources
  let:selectedFromAccount
  let:selectedToAccount
  let:setResourceSelected
  let:setTransactionManifest
>
  <Fungible
    {selectedFromAccount}
    {selectedToAccount}
    resources={resources.then((r) => r.fungible || [])}
    {setTransactionManifest}
    {setResourceSelected}
  />
</SendTokens>
