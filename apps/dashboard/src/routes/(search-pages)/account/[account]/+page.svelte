<script lang="ts">
  import { getAccountData } from '@api/utils/resources'
  import Account from '@components/_search-pages/account/Account.svelte'
  import SearchPage from '@components/_search-pages/SearchPage.svelte'
  import type { PageData } from './$types'

  export let data: PageData

  $: account = getAccountData([data.accountAddress]).then(
    (details) => details[0]!
  )
</script>

<SearchPage title="Account" address={data.accountAddress}>
  <Account {account} />
</SearchPage>
