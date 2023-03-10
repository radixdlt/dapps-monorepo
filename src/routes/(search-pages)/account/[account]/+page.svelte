<script lang="ts">
  import { getEntityDetails } from '@api/gateway'
  import { getPopulatedResources } from '@api/utils/resources'
  import Account from '@components/_search-pages/account/Account.svelte'
  import SearchPage from '@components/_search-pages/SearchPage.svelte'
  import type { PageData } from './$types'

  export let data: PageData

  $: details = getEntityDetails(data.accountAddress)

  $: resources = getPopulatedResources(data.accountAddress)
</script>

<SearchPage title="Account" address={data.accountAddress}>
  <Account {resources} {details} />
</SearchPage>
