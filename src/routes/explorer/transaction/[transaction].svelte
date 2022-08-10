<script lang="ts">
  import TransactionBox from '@components/transaction-box/TransactionBox.svelte'
  import type { Transaction } from '@types'

  export let tx: Transaction
</script>

<TransactionBox {tx} />
