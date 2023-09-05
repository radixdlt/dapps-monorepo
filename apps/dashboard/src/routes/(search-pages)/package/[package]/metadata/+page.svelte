<script lang="ts">
  import Metadata from '@dashboard-pages/search-pages/package/Metadata.svelte'
  import type { LayoutData } from '../$types'

  export let data: LayoutData
</script>

<Metadata
  metadata={data.promises.package.then(({ metadata: { all } }) => all)}
/>
