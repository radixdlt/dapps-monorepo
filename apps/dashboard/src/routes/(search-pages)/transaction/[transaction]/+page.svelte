<script lang="ts">
  import SearchPage from '@pages/search-pages/SearchPage.svelte'
  import Transaction from '@pages/search-pages/transaction/Transaction.svelte'
  import type { PageServerData } from './$types'
  import { goto } from '$app/navigation'

  export let data: PageServerData

  data.promises.tx.catch((_) => {
    goto('/not-found')
  })
</script>

<SearchPage title="Transaction" address={data.address}>
  <Transaction tx={data.promises.tx} manifest={data.promises.manifest} />
</SearchPage>
