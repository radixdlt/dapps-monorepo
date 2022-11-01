<script lang="ts">
  import TransactionBox from '@components/transaction-box/TransactionBox.svelte'

  import { query } from '@queries'
  import { page } from '$app/stores'

  const { state } = query('getTransactionStatus', $page.params.transaction)
</script>

{#if $state.status === 'success'}
  <TransactionBox tx={$state.data} />
{/if}
