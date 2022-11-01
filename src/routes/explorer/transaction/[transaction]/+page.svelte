<script lang="ts">
  import TransactionBox from '@components/transaction-box/TransactionBox.svelte'

  import { query } from '@queries'
  import { page } from '$app/stores'

  const { data, get } = query('getTransactionStatus')
  get($page.params.transaction)
</script>

{#if $data}
  <TransactionBox tx={$data} />
{/if}
