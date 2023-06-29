<script lang="ts">
  import NonFungible from '@dashboard-pages/search-pages/nft/Nft.svelte'
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<SearchPage title="Non-fungible" address={data.nftAddress}>
  <NonFungible address={data.nftAddress} />
</SearchPage>
