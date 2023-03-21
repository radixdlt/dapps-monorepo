<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Popover from '@components/_base/popover/Popover.svelte'
  import Select from '@components/_base/select/Select.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import type { FormattedAccount } from '../../side-effects'

  export let accounts: FormattedAccount[] | undefined
  export let selectedAccount: FormattedAccount | undefined
  export let showError: boolean = false
</script>

<Popover type="error" placement="right" bind:show={showError}>
  <Box wrapper cx={{ width: '300px' }}>
    <Select bind:selected={selectedAccount} options={accounts} />
  </Box>
  <Text slot="content"
    >XRD required to set metadata. Will not be required after Babylon.</Text
  >
</Popover>
