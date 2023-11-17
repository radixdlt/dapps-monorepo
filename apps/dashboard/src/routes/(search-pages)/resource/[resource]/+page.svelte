<script lang="ts">
  import Resource from '@dashboard-pages/search-pages/resource/Resource.svelte'
  import SearchPage from '@dashboard-pages/search-pages/SearchPage.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<SearchPage
  title={data.resource.resourceType === 'non-fungible'
    ? 'Non Fungible Resource'
    : data.resource.type === 'resource'
    ? 'Fungible Resource'
    : 'Pool Unit'}
  address={data.address}
>
  <Resource
    resource={Promise.resolve(data.resource)}
    associatedDapps={data.promises.associatedDapps}
    redeemableTokens={data.promises.redeemableTokens}
    tokenInfo={data.promises.authResources}
  />
</SearchPage>
