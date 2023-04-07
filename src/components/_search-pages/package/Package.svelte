<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import LoadingInfoBox from '@components/info-box/LoadingInfoBox.svelte'
  import Row from '@components/info-box/Row.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { getEntityDetails } from '@api/gateway'

  export let address: string

  $: details = getEntityDetails([address]).then((details) => details[0]!)
</script>

<Box>
  <Card>
    <Box wrapper slot="body">
      {#await details}
        <LoadingInfoBox />
      {:then details}
        <InfoBox>
          {#each details.metadata.items as metadata}
            <Row>
              <Text slot="left" bold align="right">{metadata.key}</Text>
              <Text slot="right" bold align="right">
                {metadata.value.as_string}
              </Text>
            </Row>
          {/each}
        </InfoBox>
      {/await}
    </Box>
  </Card>
</Box>
