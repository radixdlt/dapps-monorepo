<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import Header from './Header.svelte'
</script>

<Meta
  title="Header"
  component={Header}
  argTypes={{
    text: {
      control: 'text'
    }
  }}
/>

<Template>
  <Header />
</Template>

<Story name="Primary" />
