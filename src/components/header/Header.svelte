<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import ConnectButton from '@components/connect-button/ConnectButton.svelte'
  import Logo from '@components/logo/Logo.svelte'
  import NetworkLookupSearch from './NetworkLookupSearch.svelte'
  import { featureFlags } from '../../feature-flags'
</script>

<Box
  bgColor="surface"
  cx={{
    position: 'sticky',
    top: 0,
    gridArea: 'header',
    borderBottom: 'solid',
    borderWidth: '$sm',
    borderColor: '$borderColor',
    zIndex: 1000 // some elements in content area are positioned relative to this
  }}
  px="large"
  py="large"
  items="center"
  justify="between"
>
  <Logo />
  <Box bgColor="surface" cx={{ flex: 0.8 }} p="none">
    <NetworkLookupSearch />
  </Box>
  <Box bgColor="surface" cx={{ gap: '$md' }} p="none" flex="row" items="center">
    <ConnectButton />
  </Box>
</Box>
