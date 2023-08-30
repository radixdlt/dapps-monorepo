<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Metadata from '@components/metadata/Metadata.svelte'
  import type { EntityMetadataItem } from '@radixdlt/babylon-gateway-api-sdk'

  export let metadata: Promise<EntityMetadataItem[]>
</script>

<Box>
  <Card>
    <Box wrapper slot="body">
      <InfoBox>
        <Metadata {metadata} />
      </InfoBox>
    </Box>
  </Card>
</Box>
