<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import IconTextItem from './IconTextItem.svelte'
</script>

<Meta
  title="IconTextItem"
  component={IconTextItem}
  argTypes={{
    text: {
      control: 'text'
    }
  }}
/>

<Template let:args>
  <IconTextItem isActive={args.isActive} icon="accounts"
    >{args.text}</IconTextItem
  >
</Template>

<Story
  name="Primary"
  args={{
    text: 'Accounts'
  }}
/>

<Story
  name="Active"
  args={{
    text: 'Accounts',
    isActive: true
  }}
/>
