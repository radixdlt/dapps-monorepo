<script lang="ts">
  import Metadata from '@components/metadata/Metadata.svelte'
  import type { LayoutData } from '../$types'

  export let data: LayoutData
</script>

<div class="card">
  <Metadata
    metadata={data.promises.entity.then((data) => data.metadata.items)}
  />
</div>
