<script lang="ts" context="module">
  type Action = {
    from: string
    to: string
    amount: number
  }

  export type Transaction = {
    status: string
    actions: Action[]
  }
</script>

<script lang="ts">
  import TransactionBox from '@components/transaction-box/TransactionBox.svelte'
  import { query } from '@queries'
  import { page } from '$app/stores'

  const { state } = query('getTransactionStatus', $page.params.transaction)
</script>

{#if $state.status === 'success'}
  <TransactionBox tx={$state.data} />
{/if}
