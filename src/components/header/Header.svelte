<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import ThemeSwitch from '@components/_base/switch/theme-switch/ThemeSwitch.svelte'
  import ConnectButton from '@components/connect-button/ConnectButton.svelte'
  import Logo from '@components/logo/Logo.svelte'
  import { getAddressPrefix } from '@utils'
  import Search from '@components/_base/search/Search.svelte'
  import { goto } from '$app/navigation'

  let address = ''

  const search = () => {
    switch (getAddressPrefix(address)) {
      case 'account':
        goto(`/explorer/account/${address}`)
        break
      case 'resource':
        goto(`/explorer/blocks/${address}`)
        break
      case 'transaction':
        goto(`/explorer/transaction/${address}`)
        break
      case 'package':
        goto(`/explorer/package/${address}`)
        break
      case 'component':
        goto(`/explorer/component/${address}`)
        break
      default:
        goto(`/explorer/transaction/${address}`)
        break
    }
  }
</script>

<Box
  cx={{
    gridArea: 'header',
    borderBottom: 'solid',
    borderWidth: '$sm',
    borderColor: '$borderColor'
  }}
  px="large"
  items="center"
  justify="between"
>
  <Logo />
  <Box cx={{ flex: 0.8 }} p="none">
    <form on:submit|preventDefault={search}>
      <Search bind:value={address} placeholder="Enter Transaction ID" />
    </form>
  </Box>
  <Box cx={{ gap: '$md' }} p="none" flex="row" items="center">
    <ConnectButton />
    <ThemeSwitch />
  </Box>
</Box>
