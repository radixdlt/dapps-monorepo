<script lang="ts">
  import RecentTransactions from '@dashboard/components/recent-transactions/RecentTransactions.svelte'
  import type { LayoutData } from './$types'

  export let data: LayoutData
</script>

<div class="information">
  List of balance changes on this specific account. Click on Transaction ID to
  get more information.
</div>
<RecentTransactions entityAddress={data.account} />

<style lang="scss">
  .information {
    color: var(--color-grey-2);
    margin-bottom: var(--space-md);
  }
</style>
