<script lang="ts">
  import { getPopulatedResources } from '@api/utils/resources'
  import Account from '@components/_search-pages/account/Account.svelte'
  import SearchPage from '@components/_search-pages/SearchPage.svelte'
  import type { PageData } from './$types'

  export let data: PageData

  $: details = getPopulatedResources(data.accountAddress)
</script>

<SearchPage title="Account" address={data.accountAddress}>
  <Account {details} />
</SearchPage>
