<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import { query } from '@api/query'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import type { PageData } from './$types'

  export let data: PageData

  $: nftAddress = data.nftAddress

  $: ({
    send: getNfts,
    response: nftsResponse,
    loading: nftsLoading
  } = query('getNonFungibleData'))

  $: getNfts(
    nftAddress.split(':')[0] as string,
    nftAddress.split(':')[1] as string
  )

  $: ({
    send: getEntities,
    response: entitiesResponse,
    loading: entitiesLoading
  } = query('getEntityDetails'))
  $: getEntities(nftAddress.split(':')[0] as string)

  $: entries = [
    {
      key: 'ID',
      value: $nftsResponse?.non_fungible_id
    }
  ]

  $: resourceEntries = [
    {
      key: 'Address',
      value: data.nftAddress.split(':')[0]
    },
    {
      key: 'Name',
      value: $entitiesResponse?.metadata.items.find(
        (entry) => entry.key.toLowerCase() === 'name'
      )?.value
    },
    {
      key: 'Description',
      value: $entitiesResponse?.metadata.items.find(
        (entry) => entry.key.toLowerCase() === 'description'
      )?.value
    }
  ]
</script>

<Box>
  {#if $entitiesLoading}
    <SkeletonLoader />
  {:else}
    <ResourceViewTitle title="Non-fungible" resourceAddress={nftAddress} />
  {/if}
</Box>
<Box>
  <Card>
    <Text slot="header" bold>NFT Info</Text>

    <InfoBox slot="body" {entries} loading={$nftsLoading} />
  </Card>
  <Card>
    <Text slot="header" bold>Resource Info</Text>
    <InfoBox slot="body" entries={resourceEntries} loading={$entitiesLoading} />
  </Card>
</Box>
