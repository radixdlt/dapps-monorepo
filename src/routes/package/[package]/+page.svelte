<script lang="ts">
  import { query } from '@api/query'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import type { PageData } from './$types'

  export let data: PageData

  $: packageAddress = data.packageAddress

  $: ({ send, loading, response } = query('getEntityDetails'))
  $: send(data.packageAddress)
</script>

<Box>
  <ResourceViewTitle title="Package" resourceAddress={packageAddress} />
</Box>

<Box>
  <Card>
    <Box wrapper slot="body">
      {#if $loading}
        <InfoBox loading />
      {:else}
        <InfoBox entries={$response?.metadata.items} />
      {/if}
    </Box>
  </Card>
</Box>
