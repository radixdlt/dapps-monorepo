<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import MetadataInfoBox from '@components/metadata-info-box/MetadataInfoBox.svelte'
  import type { EntityMetadataItem } from '@radixdlt/babylon-gateway-api-sdk'

  export let metadata: Promise<EntityMetadataItem[]>
</script>

<Box>
  <Card>
    <Box wrapper slot="body">
      <MetadataInfoBox {metadata} />
    </Box>
  </Card>
</Box>
