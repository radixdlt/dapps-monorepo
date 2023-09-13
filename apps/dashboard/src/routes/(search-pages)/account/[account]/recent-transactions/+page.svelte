<script lang="ts">
  import type { LayoutData } from './$types'
  import { getRecentTransactions } from '@api/gateway'
  import RecentTransactions from '../../../RecentTransactions.svelte'

  export let data: LayoutData

  const queryFunction = (cursor?: string) =>
    getRecentTransactions(data.account, cursor)
</script>

<RecentTransactions {queryFunction} />
