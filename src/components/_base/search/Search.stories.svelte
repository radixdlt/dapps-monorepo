<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import Box from '../box/Box.svelte'
  import Search from './Search.svelte'
</script>

<Meta
  title="Search"
  component={Search}
  argTypes={{
    placeholderText: {
      control: 'text'
    }
  }}
/>

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
