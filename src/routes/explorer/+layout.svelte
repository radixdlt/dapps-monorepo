<script lang="ts">
  import Search from '@components/_base/search/Search.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import { goto } from '$app/navigation'
  import { getAddressPrefix } from '@utils'

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
  my="large"
  flex="col"
  gap="medium"
  items="center"
  justify="center"
  transparent
>
  <form style:width="30%" on:submit|preventDefault={search}>
    <Search bind:value={address} placeholder="Enter Transaction ID" />
  </form>
  <slot />
</Box>
