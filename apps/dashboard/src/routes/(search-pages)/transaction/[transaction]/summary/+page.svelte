<script lang="ts">
  import Summary from '@dashboard-pages/search-pages/transaction/summary/Summary.svelte'
  import type { LayoutData } from '../$types'

  export let data: LayoutData
</script>

<Summary
  manifestClass={data.promises.tx.then((tx) => tx?.manifestClass)}
  balanceChanges={data.promises.balanceChanges}
  status={data.promises.status}
  timestamp={data.promises.tx.then((tx) => (tx?.date ? tx.date : undefined))}
  message={data.promises.tx.then((tx) => tx?.message)}
/>
