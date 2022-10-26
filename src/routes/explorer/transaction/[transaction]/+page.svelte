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

  const { data, get } = query('getTransactionStatus')
  get($page.params.transaction)
</script>

<TransactionBox tx={new Promise(data.subscribe)} />
