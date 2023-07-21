<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Row from '@components/info-box/Row.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import LoadingInfoBox from '@components/info-box/LoadingInfoBox.svelte'
  import { getSingleEntityDetails } from '@api/gateway'
  import type {
    StateEntityDetailsResponseComponentDetails,
    StateEntityDetailsResponseItem,
    ReplaceProperty
  } from '@radixdlt/babylon-gateway-api-sdk'
  import MetadataInfoBox from '@components/metadata-info-box/MetadataInfoBox.svelte'

  export let address: string

  $: details = getSingleEntityDetails(address).then(
    (details) =>
      details as ReplaceProperty<
        StateEntityDetailsResponseItem,
        'details',
        StateEntityDetailsResponseComponentDetails
      >
  )

  $: metadata = details.then(({ metadata }) => metadata.items)
</script>

<Card>
  <Text bold slot="header">Info</Text>
  <div slot="body">
    {#await details}
      <LoadingInfoBox />
    {:then details}
      <InfoBox>
        <Row>
          <Text slot="left" bold align="right">Package Name</Text>
          <Text slot="right" align="left">{details.details.blueprint_name}</Text
          >
        </Row>
        <Row>
          <Text slot="left" bold align="right">Package Address</Text>
          <Text slot="right" align="left"
            >{details.details.package_address}</Text
          >
        </Row>
      </InfoBox>
    {/await}
  </div>
</Card>

<Card>
  <Text bold slot="header">Metadata</Text>
  <Box wrapper slot="body">
    <MetadataInfoBox {metadata} />
  </Box>
</Card>
