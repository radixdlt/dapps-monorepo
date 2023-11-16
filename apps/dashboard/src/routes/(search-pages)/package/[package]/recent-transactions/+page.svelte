<script lang="ts">
  import type { LayoutData } from '../$types'
  import RecentTransactions from '@dashboard/components/recent-transactions/RecentTransactions.svelte'

  export let data: LayoutData
</script>

<RecentTransactions entityAddress={data.address} />
