<script lang="ts">
  import { goto } from '$app/navigation'

  import Search from '@components/_base/search/Search.svelte'
  import { getAddressPrefix } from '@utils'

  let searchBarText = ''
  const search = (address: string) => {
    searchBarText = ''
    switch (getAddressPrefix(address)) {
      case 'account':
        goto(`/account/${address}`)
        break
      case 'resource':
        goto(`/resource/${address}`)
        break
      case 'transaction':
        goto(`/transaction/${address}`)
        break
      case 'package':
        goto(`/package/${address}`)
        break
      case 'component':
        goto(`/component/${address}`)
        break
      default:
        goto(`/transaction/${address}`)
        break
    }
  }
</script>

<Search
  onSearch={search}
  placeholder="Search for an address, transaction/block hash or validator key"
/>
