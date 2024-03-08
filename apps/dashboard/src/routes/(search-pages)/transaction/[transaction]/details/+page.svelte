<script lang="ts">
  import Overview from '@dashboard-pages/search-pages/transaction/Overview.svelte'
  import type { LayoutData } from '../$types'
  import { goto } from '$app/navigation'

  export let data: LayoutData

  data.promises.tx.then((tx) => {
    if (!tx) {
      goto(`/transaction/${data.address}/summary`)
    }
  })
</script>

<Overview tx={data.promises.tx} manifest={data.promises.manifest} />
