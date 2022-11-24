<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf'

  import ConnectPopover from './ConnectPopover.svelte'
</script>

<Meta title="ConnectPopover" component={ConnectPopover} />

<Story name="Primary">
  <ConnectPopover onConnect={() => {}} forceShow />
</Story>
