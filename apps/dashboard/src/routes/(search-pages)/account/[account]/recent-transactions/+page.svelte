<script lang="ts">
  import type { LayoutData } from './$types'
  import { getRecentTransactions } from '@api/gateway'
  import RecentTransactions from '../../../RecentTransactions.svelte'
  import { activeTab } from '../+layout.svelte'

  export let data: LayoutData

  $activeTab = 'recent-transactions'

  const queryFunction = (cursor?: string) =>
    getRecentTransactions(data.account, cursor)
</script>

<RecentTransactions {queryFunction} />
