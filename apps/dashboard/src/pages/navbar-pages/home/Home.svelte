<script>
  import RecentNetworkTransactions from '@dashboard/components/recent-transactions/RecentNetworkTransactions.svelte'
</script>

<h1>The Radix Dashboard</h1>
<h2 class="table-header">Recent Network Transactions</h2>
<RecentNetworkTransactions />

<style lang="scss">
  .table-header {
    margin: var(--spacing-2xl) 0 var(--spacing-md);
  }
</style>
