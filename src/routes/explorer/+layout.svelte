<script lang="ts">
  import Search from '@components/_base/search/Search.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import { goto } from '$app/navigation'
  import { getAddressPrefix } from '@utils'

  let id = ''

  const search = () => {
    switch (getAddressPrefix(id)) {
      case 'account':
        goto(`/explorer/accounts/${id}`)
        break
      case 'resource':
        goto(`/explorer/blocks/${id}`)
        break
      case 'transaction':
        goto(`/explorer/transaction/${id}`)
        break
      case 'package':
        goto(`/explorer/package/${id}`)
        break
      case 'component':
        goto(`/explorer/component/${id}`)
        break
      default:
        goto(`/explorer/transaction/${id}`)
        break
    }
  }
</script>

<Box my="large" justify="center" transparent>
  <form style:width="30%" on:submit|preventDefault={search}>
    <Search bind:value={id} placeholder="Enter Transaction ID" />
  </form>
  <slot />
</Box>
