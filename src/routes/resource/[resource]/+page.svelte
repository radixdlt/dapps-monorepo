<script lang="ts">
  import Resource from '@components/_search-pages/resource/Resource.svelte'

  import type { PageData } from './$types'

  export let data: PageData
</script>

<Resource address={data.resourceAddress} />
