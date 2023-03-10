<script lang="ts">
  import SearchPage from '@components/_search-pages/SearchPage.svelte'
  import Transaction from '@components/_search-pages/transaction/Transaction.svelte'
  import type { PageData } from './$types'

  export let data: PageData

  $: transactionHash = data.transactionHash
</script>

<SearchPage title="Transaction" address={transactionHash}>
  <Transaction {transactionHash} />
</SearchPage>
