<script lang="ts">
  import Raw from '@dashboard-pages/search-pages/transaction/Raw.svelte'
  import type { LayoutData } from '../$types'
  export let data: LayoutData

  $: receipt = data.promises.tx.then((tx: any) => tx!.receipt)
</script>

<Raw {receipt} />
