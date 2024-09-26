<script lang="ts">
  import PoolUnits from '@dashboard-pages/search-pages/account/pool-units/PoolUnits.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<PoolUnits poolData={data.promises.poolData} />
