<script lang="ts">
  import Metadata from '@components/metadata/Metadata.svelte'
  import type { EntityMetadataItem } from '@common/gateway-sdk'

  export let metadata: Promise<EntityMetadataItem[]>
</script>

<div class="card">
  <Metadata {metadata} />
</div>
