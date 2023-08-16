<script lang="ts">
  import Overview from '@dashboard-pages/search-pages/transaction/Overview.svelte'
  import type { LayoutData } from '../$types'

  export let data: LayoutData

  $: tx = data.promises.tx.then((tx) => tx!)
</script>

<Overview {tx} manifest={data.promises.manifest} />
