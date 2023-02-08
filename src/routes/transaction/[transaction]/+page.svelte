<script lang="ts">
  import Transaction from '@components/_search-pages/transaction/Transaction.svelte'
  import type { PageData } from './$types'

  export let data: PageData

  $: transactionHash = data.transactionHash
</script>

<Transaction {transactionHash} />
