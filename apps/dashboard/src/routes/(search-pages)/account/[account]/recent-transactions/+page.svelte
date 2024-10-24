<script lang="ts">
  import RecentTransactions from '$lib/recent-transactions/RecentTransactions.svelte'
  import FilterButton from '@dashboard/pages/navbar-pages/staking/filter-button/FilterButton.svelte'
  import TransactionFilters from '@dashboard/lib/transaction-filters/TransactionFilters.svelte'
  import { goto } from '$app/navigation'
  import ExportCsvButton from '@dashboard/pages/search-pages/export-csv-button/ExportCsvButton.svelte'
  import type { PageData } from './$types'

  export let data: PageData

  let filterPanelOpen = false
</script>

<div class="buttons">
  <div class="export-button">
    <ExportCsvButton entityAddress={data.account} />
  </div>
  <div>
    <FilterButton on:click={() => (filterPanelOpen = true)} />
  </div>
</div>

<RecentTransactions
  filters={{
    transactionType: data.filters.transactionType,
    withdrawnFrom: data.filters.withdrawnFrom ?? [],
    depositedTo: data.filters.depositedTo ?? [],
    badges: data.filters.badges ?? [],
    resources: data.filters.resources ?? [],
    affectedEntities: data.filters.affectedEntities ?? []
  }}
  entityAddress={data.account}
/>

<TransactionFilters
  bind:filterPanelOpen
  on:apply-filters={(e) => {
    goto(`/account/${data.account}/recent-transactions?${e.detail}`)
  }}
/>

<style>
  .buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: var(--spacing-xl);
    gap: var(--spacing-xl);
  }
</style>
