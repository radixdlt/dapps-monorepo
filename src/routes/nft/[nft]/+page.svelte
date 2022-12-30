<script lang="ts">
  import { page } from '$app/stores'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { AlertToast } from '@components/_base/toast/Toasts'
  import { query } from '@queries'
  import type { PageData } from './$types'

  export let data: PageData

  $: dataState = data.state

  $: ({ state } = query('getEntityDetails', data.nftAddress.split(':')[0], {
    manual: true
  }))

  $: if ($state.status === 'error') {
    AlertToast({
      title: 'Error',
      text: $state.error.message,
      type: 'error'
    })()
  }

  $: entries = [
    {
      key: 'ID',
      value: $dataState.data?.non_fungible_id
    }
  ]

  $: resourceEntries = [
    {
      key: 'Address',
      value: data.nftAddress.split(':')[0]
    },
    {
      key: 'Name',
      value: $state.data?.metadata.items.find(
        (entry) => entry.key.toLowerCase() === 'name'
      )?.value
    },
    {
      key: 'Description',
      value: $state.data?.metadata.items.find(
        (entry) => entry.key.toLowerCase() === 'description'
      )?.value
    }
  ]
</script>

<Box>
  {#if $state.status === 'loading'}
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

    <InfoBox slot="body" {entries} loading={$dataState.status === 'loading'} />
  </Card>
  <Card>
    <Text slot="header" bold>Resource Info</Text>
    <InfoBox
      slot="body"
      entries={resourceEntries}
      loading={$state.status === 'loading'}
    />
  </Card>
</Box>
