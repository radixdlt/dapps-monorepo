<script lang="ts">
  import Raw from '@dashboard-pages/search-pages/transaction/Raw.svelte'
  import type { LayoutData } from '../$types'
  import { goto } from '$app/navigation'
  export let data: LayoutData

  $: receipt = data.promises.tx.then((tx) => {
    if (tx?.receipt) {
      return tx?.receipt
    }

    goto(`/transaction/${data.address}/summary`)
  })
</script>

<Raw {receipt} />
