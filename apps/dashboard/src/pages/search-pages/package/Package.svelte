<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import { getSingleEntityDetails } from '@api/gateway'
  import MetadataInfoBox from '@components/metadata-info-box/MetadataInfoBox.svelte'

  export let address: string

  $: metadata = getSingleEntityDetails(address).then(
    ({ metadata }) => metadata.items
  )
</script>

<Box>
  <Card>
    <Box wrapper slot="body">
      <MetadataInfoBox {metadata} />
    </Box>
  </Card>
</Box>
