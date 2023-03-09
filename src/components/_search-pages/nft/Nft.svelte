<script lang="ts">
  import { getEntityDetails, getNonFungibleData } from '@api/gateway'
  import AwaitedRow from '@components/info-box/AwaitedRow.svelte'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Row from '@components/info-box/Row.svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'

  export let address: string

  $: nftData = getNonFungibleData(
    address.split(':')[0] as string,
    address.split(':')[1] as string
  )

  $: entities = getEntityDetails(address.split(':')[0] as string)
</script>

<ResourceViewTitle title="Non-fungible" resourceAddress={address} />

<Box>
  <Card>
    <Text slot="header" bold>NFT Info</Text>
    <InfoBox slot="body">
      <AwaitedRow
        text="ID"
        promise={nftData.then(({ non_fungible_id }) => non_fungible_id)}
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

      <AwaitedRow text="Name" promise={entities} let:data>
        <Text
          >{data.metadata.items.find(
            (entry) => entry.key.toLowerCase() === 'name'
          )?.value}</Text
        >
      </AwaitedRow>

      <AwaitedRow text="Description" promise={entities} let:data>
        <Text
          >{data.metadata.items.find(
            (entry) => entry.key.toLowerCase() === 'description'
          )?.value}</Text
        >
      </AwaitedRow>
    </InfoBox>
  </Card>
</Box>
