<script lang="ts">
  import NonFungible from '@dashboard-pages/search-pages/nft/Nft.svelte'
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { PageData } from './$types'
  import ErrorPage from '@dashboard-pages/error-page/ErrorPage.svelte'
  import type { ComponentProps } from 'svelte'

  export let data: PageData

  let error: ComponentProps<ErrorPage>['status']

  data.promises.nftData.catch((e) => {
    error = e.status
  })

  data.promises.resource.catch((e) => {
    error = e.status
  })
</script>

{#if error}
  <ErrorPage status={error} />
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
