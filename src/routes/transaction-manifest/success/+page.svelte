<script lang="ts">
  import Success from '@components/_navbar-pages/transaction-manifest/Success.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<Success txID={data.txID} />
