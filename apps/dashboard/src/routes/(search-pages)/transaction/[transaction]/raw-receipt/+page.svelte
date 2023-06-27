<script lang="ts">
  import Raw from '@pages/search-pages/transaction/Raw.svelte'
  import type { LayoutData } from '../$types'
  export let data: LayoutData
</script>

<Raw receipt={data.promises.tx.then((tx) => tx.receipt)} />
