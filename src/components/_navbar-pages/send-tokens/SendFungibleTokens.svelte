<script lang="ts">
  import type { Option } from '@components/_base/select/Select.svelte'
  import SendFungible from './SendFungible.svelte'
  import SendTokenForm from './SendTokens.svelte'

  type OptionsType = Option<{ address: string }>

  export let accounts: OptionsType[] | undefined = undefined
</script>

<SendTokenForm
  {accounts}
  let:resources
  let:selectedFromAccount
  let:selectedToAccount
  let:setResourceSelected
  let:setTransactionManifest
>
  <SendFungible
    {selectedFromAccount}
    {selectedToAccount}
    resources={resources?.fungible || []}
    {setTransactionManifest}
    {setResourceSelected}
  />
</SendTokenForm>
