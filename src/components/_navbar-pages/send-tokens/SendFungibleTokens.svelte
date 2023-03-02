<script lang="ts">
  import type { Option } from '@components/_base/select/Select.svelte'
  import Fungible from './token-type/Fungible.svelte'
  import SendTokens from './SendTokens.svelte'

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
  <Fungible
    {selectedFromAccount}
    {selectedToAccount}
    resources={resources.then((r) => r.fungible || [])}
    {setTransactionManifest}
    {setResourceSelected}
  />
</SendTokens>
