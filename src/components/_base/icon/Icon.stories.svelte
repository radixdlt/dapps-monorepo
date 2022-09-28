<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import Icon from './Icon.svelte'
  import Box from '../box/Box.svelte'
  import { icons } from '../../../icon-assets'
</script>

<Meta title="Icon" component={Icon} />

<Template let:args>
  Active state
  <Box>
    <Icon {...args} type={icons.dashboard} interactive />
    <Icon {...args} type={icons.blocks} />
    <Icon {...args} type={icons.tokens} />
    <Icon {...args} type={icons.transactions} />
    <Icon {...args} type={icons.validators} />
    <Icon {...args} type={icons.accounts} />
  </Box>
</Template>

<Story
  name="Primary"
  args={{
    isActive: true
  }}
/>

<Story
  name="Secondary"
  args={{
    isActive: false,
    interactive: true
  }}
/>
