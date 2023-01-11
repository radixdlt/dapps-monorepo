<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import { query } from '@queries'
  import type { PageData } from './$types'

  export let data: PageData

  $: componentAddress = data.componentAddress

  $: ({ state } = query('getEntityDetails', componentAddress, {
    manual: false
  }))
</script>

<Box>
  <ResourceViewTitle title="Package" resourceAddress={componentAddress} />
</Box>

<Box>
  <Card>
    <Box wrapper slot="body">
      {#if $state.status === 'loading'}
        <InfoBox loading />
      {:else}
        <InfoBox entries={$state.data?.metadata.items} />
      {/if}
    </Box>
  </Card>
</Box>
