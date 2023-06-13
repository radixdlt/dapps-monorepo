<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import SidePanel from './SidePanel.svelte'

  import Button from '../button/ButtonNew.svelte'

  let open = false
</script>

<Meta title="Base Components / Side Panel" />

<Story name="Primary">
  <SidePanel bind:open>Content</SidePanel>

  <Button on:click={() => (open = true)} size="big">Open</Button>
</Story>
