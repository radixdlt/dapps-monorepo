<script context="module">
  export const meta = {
    argTypes: {
      placeholderText: {
        control: 'text'
      }
    }
  }
</script>

<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import Box from '../box/Box.svelte'
  import Search from './Search.svelte'
</script>

<Template let:args>
  <Box justify="center" cx={{ width: '$4xl' }}>
    <Search onSearch={() => {}} placeholder={args.placeholderText} />
  </Box>
</Template>

<Story
  name="Primary"
  args={{
    placeholderText: 'Placeholder'
  }}
/>
