<script lang="ts">
  import { goto } from '$app/navigation'
  import Search from '@components/_base/search/Search.svelte'
  import { addressToRoute } from '../../utils'

  const search = (address: string) => goto(addressToRoute(address))
</script>

<Search
  onSearch={search}
  placeholder="Search for a transaction ID, or an address for an account, or a resource"
/>
