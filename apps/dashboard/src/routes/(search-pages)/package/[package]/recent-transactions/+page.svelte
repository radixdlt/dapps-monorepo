<script lang="ts">
  import type { LayoutData } from '../$types'
  import RecentTransactions from '../../../RecentTransactions.svelte'

  export let data: LayoutData
</script>

<RecentTransactions entityAddress={data.address} />
