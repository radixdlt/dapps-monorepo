<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import NextHeader from './NextHeader.svelte'
</script>

<Meta
  title="NextHeader"
  component={NextHeader}
  argTypes={{
    text: {
      control: 'text'
    }
  }}
/>

<Template>
  <NextHeader />
</Template>

<Story name="Primary" />
