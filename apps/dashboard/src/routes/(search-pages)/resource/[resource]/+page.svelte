<script lang="ts">
  import Resource from '@dashboard-pages/search-pages/resource/Resource.svelte'
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { PageData } from './$types'
  import NotFound from '@dashboard-pages/not-found/NotFound.svelte'

  export let data: PageData
</script>

{#await data.promises.resource then resource}
  <SearchPage
    title={resource.resourceType === 'non-fungible'
      ? 'Non Fungible Resource'
      : resource.type === 'resource'
      ? 'Fungible Resource'
      : 'Pool Unit'}
    address={data.address}
  >
    <Resource
      resource={data.promises.resource}
      associatedDapps={data.promises.associatedDapps}
      redeemableTokens={data.promises.redeemableTokens.then((tokens) =>
        tokens?.map((token) => ({
          iconUrl: token.icon?.href,
          name: token.name
        }))
      )}
    />
  </SearchPage>
{:catch}
  <NotFound />
{/await}
