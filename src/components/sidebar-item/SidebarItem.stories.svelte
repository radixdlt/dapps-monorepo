<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import SidebarItem from './SidebarItem.svelte'
</script>

<Meta
  title="SidebarItem"
  component={SidebarItem}
  argTypes={{
    text: {
      control: 'text'
    }
  }}
/>

<Template let:args>
  <SidebarItem isActive={args.isActive} icon="accounts">{args.text}</SidebarItem
  >
  <SidebarItem icon="accounts">{args.text}</SidebarItem>
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
    text: 'Accosunts',
    isActive: true
  }}
/>
