<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import Theme from '../theme/Theme.svelte'
  import Button from './Button.svelte'
</script>

<Meta
  title="Button"
  component={Button}
  argTypes={{
    text: {
      control: 'text'
    },
    disabled: {
      control: 'boolean'
    },
    color: {
      control: 'color'
    }
  }}
/>

<Theme theme="light">
  <Template let:args>
    <Button size="small">{args.text}</Button>
    <Button size="large">{args.text}</Button>
    <Button size="large" loading>{args.text}</Button>
    <Button disabled>Disabled</Button>
  </Template>
</Theme>

<Story
  name="Primary"
  args={{
    text: 'Test'
  }}
/>
