<script lang="ts">
  import type { LayoutData } from '../$types'
  import { getRecentTransactions } from '@api/gateway'
  import { context } from '../+layout.svelte'
  import RecentTransactions from '../../../RecentTransactions.svelte'

  export let data: LayoutData

  const activeTab = context.get('activeTab')
  $activeTab = 'recent-transactions'

  const queryFunction = (cursor?: string) =>
    getRecentTransactions(data.address, cursor)
</script>

<RecentTransactions {queryFunction} />
