<script lang="ts">
  import { getEntityDetails, getNonFungibleData } from '@api/gateway'
  import AwaitedRow from '@components/info-box/AwaitedRow.svelte'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Row from '@components/info-box/Row.svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import type { PageData } from './$types'

  export let data: PageData

  $: nftAddress = data.nftAddress

  $: nftData = getNonFungibleData(
    nftAddress.split(':')[0] as string,
    nftAddress.split(':')[1] as string
  )

  $: entities = getEntityDetails(nftAddress.split(':')[0] as string)
</script>

<Box>
  <ResourceViewTitle title="Non-fungible" resourceAddress={nftAddress} />
</Box>

<Box>
  <Card>
    <Text slot="header" bold>NFT Info</Text>
    <InfoBox>
      <AwaitedRow
        text="ID"
        promise={nftData.then(({ non_fungible_id }) => non_fungible_id)}
      />
    </InfoBox>
  </Card>
  <Card>
    <Text slot="header" bold>Resource Info</Text>
    <InfoBox>
      <Row text="Address">
        <Text>{data.nftAddress.split(':')[0]}</Text>
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
