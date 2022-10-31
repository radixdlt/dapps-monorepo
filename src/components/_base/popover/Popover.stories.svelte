<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import Popover from './Popover.svelte'
</script>

<Meta title="Popover" />

<Story name="Primary">
  <Popover>
    <button slot="button">Open panel</button>
    <div slot="content">Panel</div>
  </Popover>
</Story>
