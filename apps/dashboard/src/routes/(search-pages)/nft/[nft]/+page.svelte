<script lang="ts">
  import NonFungible from '@pages/_search-pages/nft/Nft.svelte'
  import SearchPage from '@pages/_search-pages/SearchPage.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<SearchPage title="Non-fungible" address={data.nftAddress}>
  <NonFungible address={data.nftAddress} />
</SearchPage>
