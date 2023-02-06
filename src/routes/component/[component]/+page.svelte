<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import { getEntityDetails } from '@api/gateway'
  import type { PageData } from './$types'

  export let data: PageData

  $: response = getEntityDetails(data.componentAddress)
</script>

<Box>
  <ResourceViewTitle title="Package" resourceAddress={data.componentAddress} />
</Box>

<Box>
  <Card>
    <Box wrapper slot="body">
      {#await response}
        <InfoBox loading />
      {:then details}
        <InfoBox entries={details.metadata.items} />
      {/await}
    </Box>
  </Card>
</Box>
