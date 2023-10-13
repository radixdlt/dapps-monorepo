<script lang="ts">
  import Summary from '@dashboard-pages/search-pages/transaction/summary/Summary.svelte'
  import type { LayoutData } from '../$types'

  export let data: LayoutData
</script>

<Summary
  balanceChanges={data.promises.balanceChanges}
  status={data.promises.tx.then(({ status }) =>
    status === 'CommittedSuccess' ? 'Complete' : 'Failure'
  )}
  timestamp={data.promises.tx.then((tx) => (tx.date ? tx.date : undefined))}
  message={data.promises.tx.then((tx) => tx.message)}
/>
