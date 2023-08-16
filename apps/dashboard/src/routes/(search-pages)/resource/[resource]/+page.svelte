<script lang="ts">
  import NonFungible from '@dashboard-pages/search-pages/resource/non-fungible/NonFungible.svelte'
  import Resource from '@dashboard-pages/search-pages/resource/Resource.svelte'
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { PageData } from './$types'
  import NotFound from '@dashboard-pages/not-found/NotFound.svelte'

  export let data: PageData
</script>

{#await data.promises.details then resolvedDetails}
  {#if resolvedDetails}
    {#if resolvedDetails.details?.type === 'FungibleResource'}
      <SearchPage title="Fungible Resource" address={data.address}>
        <Resource details={Promise.resolve(resolvedDetails)} />
      </SearchPage>
    {/if}

    {#if resolvedDetails.details?.type === 'NonFungibleResource'}
      <SearchPage title="Non-Fungible Resource" address={data.address}>
        <Resource details={Promise.resolve(resolvedDetails)}>
          <NonFungible address={data.address} />
        </Resource>
      </SearchPage>
    {/if}
  {/if}
{:catch}
  <NotFound />
{/await}
