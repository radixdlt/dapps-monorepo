<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import Input from './Input.svelte'
</script>

<Meta
  title="Input"
  component={Input}
  argTypes={{
    placeholderText: {
      control: 'text'
    }
  }}
/>

<Template let:args>
  <Input placeholder={args.placeholderText} />
</Template>

<Story
  name="Primary"
  args={{
    placeholderText: 'Placeholder'
  }}
/>
