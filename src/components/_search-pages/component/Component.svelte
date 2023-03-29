<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import { query } from '@api/query'
  import Row from '@components/info-box/Row.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import LoadingInfoBox from '@components/info-box/LoadingInfoBox.svelte'

  export let address: string

  $: ({ send, loading, response } = query('getEntityDetails'))
  $: send(address)
</script>

<Box>
  <Card>
    <Box wrapper slot="body">
      {#if !$loading && $response}
        <InfoBox>
          {#each $response.metadata.items as metadata}
            <Row>
              <Text slot="left" bold align="right">{metadata.key}</Text>
              <Text slot="right" bold align="right">{metadata.value}</Text>
            </Row>
          {/each}
        </InfoBox>
      {:else}
        <LoadingInfoBox />
      {/if}
    </Box>
  </Card>
</Box>
