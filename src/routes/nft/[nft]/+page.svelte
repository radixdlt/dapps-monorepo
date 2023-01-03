<script lang="ts">
  import { page } from '$app/stores'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { query } from '@queries'
  import type { PageData } from './$types'

  export let data: PageData

  $: nftAddress = data.nftAddress

  $: ({ state: nftData } = query('getNonFungibleData', {
    address: nftAddress.split(':')[0],
    id: nftAddress.split(':')[1]
  }))

  $: ({ state: entityDetails } = query(
    'getEntityDetails',
    nftAddress.split(':')[0],
    {
      manual: true
    }
  ))

  $: entries = [
    {
      key: 'ID',
      value: $nftData.data?.non_fungible_id
    }
  ]

  $: resourceEntries = [
    {
      key: 'Address',
      value: data.nftAddress.split(':')[0]
    },
    {
      key: 'Name',
      value: $entityDetails.data?.metadata.items.find(
        (entry) => entry.key.toLowerCase() === 'name'
      )?.value
    },
    {
      key: 'Description',
      value: $entityDetails.data?.metadata.items.find(
        (entry) => entry.key.toLowerCase() === 'description'
      )?.value
    }
  ]
</script>

<Box>
  {#if $entityDetails.status === 'loading'}
    <SkeletonLoader />
  {:else}
    <ResourceViewTitle
      title={'Non-fungible'}
      resourceAddress={$page.params.nft}
    />
  {/if}
</Box>
<Box>
  <Card>
    <Text slot="header" bold>NFT Info</Text>

    <InfoBox slot="body" {entries} loading={$nftData.status === 'loading'} />
  </Card>
  <Card>
    <Text slot="header" bold>Resource Info</Text>
    <InfoBox
      slot="body"
      entries={resourceEntries}
      loading={$entityDetails.status === 'loading'}
    />
  </Card>
</Box>
