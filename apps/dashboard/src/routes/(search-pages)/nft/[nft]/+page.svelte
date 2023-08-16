<script lang="ts">
  import NonFungible from '@dashboard-pages/search-pages/nft/Nft.svelte'
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { PageData } from './$types'
  import NotFound from '@dashboard-pages/not-found/NotFound.svelte'

  export let data: PageData

  let notFound = false

  data.promises.details.catch(() => (notFound = true))
</script>

{#if notFound}
  <NotFound />
{:else}
  <SearchPage title="Non-fungible" address={data.nftAddress}>
    <NonFungible
      address={data.nftAddress}
      nftData={data.promises.nftData}
      details={data.promises.details}
    />
  </SearchPage>
{/if}
