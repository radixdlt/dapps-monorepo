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
  import { AlertToast } from '@components/_base/toast/Toasts'

  const { state } = query('getTransactionStatus', $page.params.transaction)

  $: if ($state.status === 'error') {
    AlertToast({
      title: 'Error',
      text: $state.error.message,
      type: 'error'
    })
  }
</script>

<TransactionBox tx={$state.data} loading={$state.status === 'loading'} />
