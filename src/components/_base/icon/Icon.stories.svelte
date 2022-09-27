<script lang="ts">
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import Icon from './Icon.svelte'
  import Box from '../box/Box.svelte'
</script>

<Meta title="Icon" component={Icon} />

<Template>
  Active state
  <Box>
    <Icon type="dashboard" interactive isActive />
    <Icon type="blocks" isActive />
    <Icon type="tokens" isActive />
    <Icon type="transactions" isActive />
    <Icon type="validators" isActive />
    <Icon type="accounts" isActive />
  </Box>
  Inactive state
  <Box>
    <Icon type="dashboard" />
    <Icon type="blocks" />
    <Icon type="tokens" />
    <Icon type="transactions" />
    <Icon type="validators" />
    <Icon type="accounts" />
  </Box>
</Template>

<Story name="Primary" />
