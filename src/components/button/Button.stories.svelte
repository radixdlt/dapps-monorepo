<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import Button from './Button.svelte'
</script>

<Meta
  title="Button"
  component={Button}
  argTypes={{
    text: {
      control: 'text'
    },
    color: {
      control: 'color'
    }
  }}
/>

<Template let:args>
  <Button>{args.text}</Button>
  <Button size="small">{args.text}</Button>
  <Button ghost>{args.text}</Button>
</Template>

<Story
  name="Primary"
  args={{
    text: 'Test'
  }}
/>
