<script lang="ts">
  import SendTokens from './SendTokens.svelte'
  import NonFungible from './token-type/NonFungible.svelte'
</script>

<SendTokens
  let:resources
  let:selectedFromAccount
  let:selectedToAccount
  let:setResourceSelected
  let:setTransactionManifest
>
  <NonFungible
    {selectedFromAccount}
    {selectedToAccount}
    resources={resources.then((r) => r.nonFungible || [])}
    {setTransactionManifest}
    {setResourceSelected}
  />
</SendTokens>
