<script>
  import RecentNetworkTransactions from '@dashboard/components/recent-transactions/RecentNetworkTransactions.svelte'
</script>

<h1>The Radix Dashboard</h1>
<p class="paragraph">
  Use the Radix Dashboard as your network Explorer, or to stake and unstake
  Radix tokens and claim XRD from validators.
</p>
<h2 class="table-header">Recent Network Transactions</h2>
<RecentNetworkTransactions />

<style lang="scss">
  .paragraph {
    color: var(--color-grey-2);
    font-size: var(--text-lg);
  }

  .table-header {
    margin: var(--spacing-2xl) 0 var(--spacing-md);
  }
</style>
