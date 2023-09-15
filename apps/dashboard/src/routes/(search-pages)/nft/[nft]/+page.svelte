<script lang="ts">
  import NonFungible from '@dashboard-pages/search-pages/nft/Nft.svelte'
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { PageData } from './$types'
  import NotFound from '@dashboard-pages/not-found/NotFound.svelte'

  export let data: PageData

  let notFound = false

  data.promises.nftData.catch(() => (notFound = true))
  data.promises.resource.catch(() => (notFound = true))
</script>

{#if notFound}
  <NotFound />
{:else}
  {#await data.promises.nftData then nftData}
    <SearchPage
      title={nftData.type === 'generalNft'
        ? 'Non Fungible'
        : 'Radix Network Stake Claim Non-fungible'}
      address={data.nftAddress}
    >
    <NonFungible
      nft={data.promises.nftData}
      resource={data.promises.resource}
      associatedDapps={data.promises.associatedDapps}
    />
  </SearchPage>
  {/await}
{/if}
