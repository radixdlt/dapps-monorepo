<script lang="ts">
  import { getStringMetadata } from '@api/utils/resources'
  import AwaitedRow from '@components/info-box/AwaitedRow.svelte'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Row from '@components/info-box/Row.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import type {
    StateEntityDetailsVaultResponseItem,
    StateNonFungibleDetailsResponseItem
  } from '@radixdlt/babylon-gateway-api-sdk'

  export let address: string

  export let nftData: Promise<
    | StateNonFungibleDetailsResponseItem[]
    | {
        non_fungible_id: string
      }[]
  >

  export let details: Promise<void | StateEntityDetailsVaultResponseItem>
</script>

<Box>
  <Card>
    <Text slot="header" bold>NFT Info</Text>
    <InfoBox slot="body">
      <AwaitedRow
        text="ID"
        promise={nftData.then(([{ non_fungible_id }]) => non_fungible_id)}
      />
    </InfoBox>
  </Card>
  <Card>
    <Text slot="header" bold>Resource Info</Text>
    <InfoBox slot="body">
      <Row text="Address">
        <Text color="link" inline slot="right">
          <a href="/resource/{address.split(':')[0]}">{address.split(':')[0]}</a
          >
        </Text>
      </Row>

      <AwaitedRow text="Name" promise={details} let:data>
        {#if data}
          <Text>{getStringMetadata('name')(data.metadata)}</Text>
        {/if}
      </AwaitedRow>

      <AwaitedRow text="Description" promise={details} let:data>
        {#if data}
          <Text>{getStringMetadata('description')(data.metadata)}</Text>
        {/if}
      </AwaitedRow>
    </InfoBox>
  </Card>
</Box>
