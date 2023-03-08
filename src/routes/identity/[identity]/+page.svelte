<script lang="ts">
  import Identity from '@components/_search-pages/identity/Identity.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<Identity address={data.address} />
