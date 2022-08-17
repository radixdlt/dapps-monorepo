<script lang="ts">
  import TransactionBox from '@components/transaction-box/TransactionBox.svelte'
  import type { Transaction } from './[transaction]'

  export let tx: Transaction
</script>

<TransactionBox {tx} />
