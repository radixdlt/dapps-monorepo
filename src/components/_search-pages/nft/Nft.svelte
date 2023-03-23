<script lang="ts">
  import { getEntityDetails, getNonFungibleData } from '@api/gateway'
  import AwaitedRow from '@components/info-box/AwaitedRow.svelte'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Row from '@components/info-box/Row.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'

  export let address: string

  const [resourceAddress = '', nftId = ''] = address.includes(':')
    ? address.split(':')
    : [address, '']

  $: nftData = getNonFungibleData(resourceAddress, nftId)

  $: entities = getEntityDetails(resourceAddress)
</script>

<Box>
  <Card>
    <Text slot="header" bold>NFT Info</Text>
    <InfoBox slot="body">
      <AwaitedRow
        text="ID"
        promise={nftData.then(
          ({ non_fungible_ids }) => non_fungible_ids[0]?.non_fungible_id
        )}
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
