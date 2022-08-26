<script lang="ts">
  import type { PageData } from './$types'
  import TransactionBox from '@components/transaction-box/TransactionBox.svelte'

  export let data: PageData
</script>

<TransactionBox tx={data.tx} />
