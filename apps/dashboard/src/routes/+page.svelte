<script lang="ts">
  import { goto } from '$app/navigation'
  import RecentNetworkTransactions from '$lib/recent-transactions/RecentNetworkTransactions.svelte'
  import FilterButton from '@dashboard/pages/navbar-pages/staking/filter-button/FilterButton.svelte'
  import type { PageData } from './$types'
  import TransactionFilters from '@dashboard/lib/transaction-filters/TransactionFilters.svelte'

  export let data: PageData

  let filterPanelOpen = false
</script>

<div class="table-header">
  <h2>Recent Network Transactions</h2>

  <FilterButton on:click={() => (filterPanelOpen = true)} />
</div>

<RecentNetworkTransactions queryFunction={data.queryFn} />

<TransactionFilters
  bind:filterPanelOpen
  transactionType={data.filters.transactionType}
  withdrawnFrom={data.filters.withdrawnFrom ?? []}
  depositedTo={data.filters.depositedTo ?? []}
  badges={data.filters.badges ?? []}
  resources={data.filters.resources ?? []}
  affectedEntities={data.filters.affectedEntities ?? []}
  on:apply-filters={(e) => {
    goto(`/?${e.detail}`)
  }}
/>

<style>
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xl);
  }
</style>
