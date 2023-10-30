<script lang="ts">
  import RecentTransactions from '../../../RecentTransactions.svelte'
  import type { LayoutData } from '../$types'

  export let data: LayoutData
</script>

<RecentTransactions entityAddress={data.address} />
