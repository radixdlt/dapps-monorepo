<script lang="ts">
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Row from '@components/info-box/Row.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import LoadingInfoBox from '@components/info-box/LoadingInfoBox.svelte'
  import type {
    StateEntityDetailsResponseComponentDetails,
    StateEntityDetailsResponseItem,
    ReplaceProperty
  } from '@radixdlt/babylon-gateway-api-sdk'
  import Metadata from '@components/metadata/Metadata.svelte'

  export let details: Promise<
    ReplaceProperty<
      StateEntityDetailsResponseItem,
      'details',
      StateEntityDetailsResponseComponentDetails
    >
  >
</script>

<Card>
  <Text bold slot="header">Info</Text>
  <div slot="body">
    {#await details}
      <LoadingInfoBox />
    {:then details}
      {#if details}
        <InfoBox>
          <Row>
            <Text slot="left" bold align="right">Package Name</Text>
            <Text slot="right" align="left"
              >{details.details.blueprint_name}</Text
            >
          </Row>
          <Row>
            <Text slot="left" bold align="right">Package Address</Text>
            <Text slot="right" align="left"
              >{details.details.package_address}</Text
            >
          </Row>
        </InfoBox>
      {/if}
    {/await}
  </div>
</Card>

<Card>
  <Text bold slot="header">Metadata</Text>
  <Box wrapper slot="body">
    <InfoBox>
      <Metadata metadata={details.then((value) => value?.metadata?.items)} />
    </InfoBox>
  </Box>
</Card>
