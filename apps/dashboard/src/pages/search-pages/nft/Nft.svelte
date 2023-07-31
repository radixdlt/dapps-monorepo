<script lang="ts">
  import { getNonFungibleData, getSingleEntityDetails } from '@api/gateway'
  import { getStringMetadata } from '@api/utils/resources'
  import AwaitedRow from '@components/info-box/AwaitedRow.svelte'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Row from '@components/info-box/Row.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { goto } from '$app/navigation'

  export let address: string

  const [resourceAddress = '', nftId = ''] = address.includes(':')
    ? address.split(':')
    : [address, '']

  $: nftData = getNonFungibleData(resourceAddress, [nftId]).catch(() => [
    { non_fungible_id: '' }
  ])

  $: details = getSingleEntityDetails(resourceAddress).catch(() => {
    goto('/not-found') as never
  })
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
