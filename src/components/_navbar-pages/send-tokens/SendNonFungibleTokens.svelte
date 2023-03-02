<script lang="ts">
  import SendTokens from './SendTokens.svelte'
  import type { Option } from '@components/_base/select/Select.svelte'
  import NonFungible from './token-type/NonFungible.svelte'

  type OptionsType = Option<{ address: string }>

  export let accounts: OptionsType[] | undefined = undefined
</script>

<SendTokens
  {accounts}
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
