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
    }
  }}
/>

<Template let:args>
  <Button>{args.text}</Button>
</Template>

<Story
  name="Primary"
  args={{
    text: 'Test'
  }}
/>
