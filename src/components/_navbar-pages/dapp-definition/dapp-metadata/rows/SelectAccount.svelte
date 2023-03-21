<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Popover from '@components/_base/popover/Popover.svelte'
  import Select from '@components/_base/select/Select.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import type { FormattedAccount } from '../DappMetadata.svelte'

  export let accounts: FormattedAccount[] | undefined
  export let selectedAccount: FormattedAccount | undefined
  export let showError: boolean = false
</script>

<Popover type="error" placement="right" bind:show={showError}>
  <Box wrapper cx={{ width: '300px' }}>
    <Select bind:selected={selectedAccount} options={accounts} />
  </Box>
  <Text slot="content">Please deposit some XRD to this account.</Text>
</Popover>
