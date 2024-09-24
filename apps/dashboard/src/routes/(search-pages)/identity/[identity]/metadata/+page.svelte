<script lang="ts">
  import Metadata from '@components/metadata/Metadata.svelte'
  import type { LayoutData } from '../$types'

  export let data: LayoutData
</script>

<div class="card">
  <Metadata
    --label-text-transform="none"
    metadata={data.promises.entityDetails.then(
      ({ metadata }) => metadata.items
    )}
  />
</div>
