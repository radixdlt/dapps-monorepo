<script lang="ts">
  import Overview from '@dashboard-pages/search-pages/transaction/Overview.svelte'
  import type { LayoutData } from '../$types'

  export let data: LayoutData
</script>

<Overview tx={data.promises.tx} manifest={data.promises.manifest} />
