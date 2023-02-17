<script lang="ts">
  import Component from '@components/_search-pages/component/Component.svelte'

  import type { PageData } from './$types'

  export let data: PageData
</script>

<Component address={data.componentAddress} />
