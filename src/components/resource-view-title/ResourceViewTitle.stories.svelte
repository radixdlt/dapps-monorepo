<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import ResourceViewTitle from './ResourceViewTitle.svelte'
</script>

<Meta
  title="ResourceViewTitle"
  argTypes={{
    title: {
      control: 'text'
    },
    resourceAddress: {
      control: 'text'
    }
  }}
/>

<Template let:args>
  <ResourceViewTitle {...args} />
</Template>

<Story
  name="Primary"
  args={{
    title: 'Test title',
    resourceAddress:
      'account_tdx_b_1q0ea7gt9nvd24dqrtrcvgz2r95mwv8ld7l83vde2pdkscpc35t'
  }}
/>
