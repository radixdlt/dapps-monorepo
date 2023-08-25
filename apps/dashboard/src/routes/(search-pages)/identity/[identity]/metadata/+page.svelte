<script lang="ts">
  import MetadataInfoBox from '@components/metadata-info-box/MetadataInfoBox.svelte'
  import type { LayoutData } from '../$types'

  export let data: LayoutData

  const metadata = data.promises.entityDetails.then(
    ({ metadata }) => metadata.items
  )
</script>

<div class="card">
  <MetadataInfoBox {metadata} />
</div>
