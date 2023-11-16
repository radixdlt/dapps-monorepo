<script lang="ts">
  import RecentTransactions from '@dashboard/components/recent-transactions/RecentTransactions.svelte'
  import type { LayoutData } from '../$types'

  export let data: LayoutData
</script>

<RecentTransactions entityAddress={data.address} />
