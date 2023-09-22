<script lang="ts">
  import { getRecentTransactions } from '@api/gateway'
  import RecentTransactions from '../../../RecentTransactions.svelte'
  import type { LayoutData } from '../$types'

  export let data: LayoutData

  const queryFunction = (cursor?: string) =>
    getRecentTransactions(data.address, cursor)
</script>

<RecentTransactions {queryFunction} />
