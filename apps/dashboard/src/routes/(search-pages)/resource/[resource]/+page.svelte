<script lang="ts">
  import { getSingleEntityDetails } from '@api/gateway'
  import NonFungible from '@dashboard-pages/search-pages/resource/non-fungible/NonFungible.svelte'
  import Resource from '@dashboard-pages/search-pages/resource/Resource.svelte'
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { PageData } from './$types'
  import { goto } from '$app/navigation'

  export let data: PageData

  $: details = getSingleEntityDetails(data.address).catch(() => {
    goto('/not-found') as never
  })
</script>

{#await details then resolvedDetails}
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
{/await}
