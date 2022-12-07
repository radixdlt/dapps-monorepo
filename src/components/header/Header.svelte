<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import ThemeSwitch from '@components/_base/switch/theme-switch/ThemeSwitch.svelte'
  import ConnectButton from '@components/connect-button/ConnectButton.svelte'
  import Logo from '@components/logo/Logo.svelte'
  import NetworkLookupSearch from './NetworkLookupSearch.svelte'
</script>

<Box
  cx={{
    gridArea: 'header',
    borderBottom: 'solid',
    borderWidth: '$sm',
    borderColor: '$borderColor'
  }}
  px="large"
  py="large"
  items="center"
  justify="between"
>
  <Logo />
  <Box cx={{ flex: 0.8 }} p="none">
    <NetworkLookupSearch />
  </Box>
  <Box cx={{ gap: '$md' }} p="none" flex="row" items="center">
    <ConnectButton />
    <ThemeSwitch />
  </Box>
</Box>
