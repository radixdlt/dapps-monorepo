<script lang="ts">
  import Resource from '@dashboard-pages/search-pages/resource/Resource.svelte'
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { PageData } from './$types'
  import NotFound from '@dashboard-pages/not-found/NotFound.svelte'
  import {
    transformFungibleResource,
    transformNonFungibleResource
  } from '@api/utils/entities/resource'

  export let data: PageData
</script>

{#await data.promises.resource then resource}
  <SearchPage
    title={resource.details?.type === 'FungibleResource'
      ? 'Fungible Resource'
      : 'Non Fungible Resource'}
    address={data.address}
  >
    <Resource
      resource={data.promises.resource.then((resource) =>
        resource.details?.type === 'FungibleResource'
          ? transformFungibleResource(resource)
          : transformNonFungibleResource(resource)
      )}
      associatedDapps={data.promises.associatedDapps}
    />
  </SearchPage>
{:catch}
  <NotFound />
{/await}
