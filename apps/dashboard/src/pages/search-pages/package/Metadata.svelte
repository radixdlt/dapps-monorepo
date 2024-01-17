<script lang="ts">
  import Metadata from '@svelte-ui/components/metadata/Metadata.svelte'
  import type { EntityMetadataItem } from '@common/utils/gateway-sdk'

  export let metadata: Promise<EntityMetadataItem[]>
</script>

<div class="card">
  <Metadata {metadata} />
</div>
