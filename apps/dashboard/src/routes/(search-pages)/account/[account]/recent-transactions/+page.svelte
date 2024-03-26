<script lang="ts">
  import RecentTransactions from '$lib/recent-transactions/RecentTransactions.svelte'
  import type { LayoutData } from './$types'

  export let data: LayoutData
</script>

<RecentTransactions entityAddress={data.account} />
