<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import Box from '@components/_base/box/Box.svelte'
  import Button from '../button/Button.svelte'
  import Dialog from './Dialog.svelte'

  let open = false
</script>

<Meta
  title="Dialog"
  component={Dialog}
  argTypes={{
    size: {
      options: ['small', 'medium', 'large'],
      control: {
        type: 'select'
      }
    }
  }}
/>

<Template let:args>
  <Dialog
    bind:open
    size={args.size === 'small'
      ? '$4xl'
      : args.size === 'medium'
      ? '$5xl'
      : '$6xl'}
  >
    <Box slot="title" transparent>Title</Box>
    <Box slot="description" transparent>Description</Box>
  </Dialog>
  <Button on:click={() => (open = true)}>Open Dialog</Button>
</Template>

<Story name="Primary" />
