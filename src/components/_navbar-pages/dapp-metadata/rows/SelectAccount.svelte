<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Select from '@components/_base/select/Select.svelte'
  import type { FormattedAccount } from '../DappMetadata.svelte'

  export let accounts: FormattedAccount[] | undefined
  export let selectedAccount: FormattedAccount | undefined
</script>

<Box wrapper cx={{ width: '300px' }}>
  <Select bind:selected={selectedAccount} options={accounts} />
</Box>
