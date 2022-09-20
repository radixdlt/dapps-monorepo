<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import Search from './Search.svelte'
</script>

<Meta
  title="Input"
  component={Search}
  argTypes={{
    placeholderText: {
      control: 'text'
    }
  }}
/>

<Template let:args>
  <Search placeholder={args.placeholderText} />
</Template>

<Story
  name="Primary"
  args={{
    placeholderText: 'Placeholder'
  }}
/>
