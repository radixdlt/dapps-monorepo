<script lang="ts">
  import NonFungible from '@components/_search-pages/nft/Nft.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<NonFungible address={data.nftAddress} />
