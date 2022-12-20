<script lang="ts">
  import { page } from '$app/stores'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Divider from '@components/_base/divider/Divider.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { AlertToast } from '@components/_base/toast/Toasts'
  import type { PageData } from './$types'

  export let data: PageData
  $: entityDetailsState = data.entityDetailsState

  $: if ($entityDetailsState.status === 'error') {
    AlertToast({
      title: 'Error',
      text: $entityDetailsState.error.message,
      type: 'error'
    })()
  }

  $: entries = [
    {
      key: 'Description',
      value: $entityDetailsState.data?.metadata.items.find(
        (item) => item.key.toLowerCase() === 'description'
      )?.value
    },
    {
      key: 'Total supply',
      value: $entityDetailsState.data?.details.total_supply
    },
    ...($entityDetailsState.data?.metadata.items.filter(
      (item) =>
        !['description', 'symbol', 'name', 'url'].some(
          (key) => key === item.key.toLowerCase()
        )
    ) ?? [])
  ]

  $: symbol = $entityDetailsState.data?.metadata.items.find(
    (item) => item.key.toLowerCase() === 'symbol'
  )?.value

  $: name = $entityDetailsState.data?.metadata.items.find(
    (item) => item.key.toLowerCase() === 'name'
  )?.value

  $: url = $entityDetailsState.data?.metadata.items.find(
    (item) => item.key.toLowerCase() === 'url'
  )?.value

  $: resourceType = $entityDetailsState.data?.details.discriminator
    ? {
        fungible_resource: 'Fungible Resource',
        non_fungible_resource: 'Non Fungible Resource'
      }[$entityDetailsState.data?.details.discriminator]
    : ''
</script>

<Box transparent m="none" px="none" full>
  {#if $entityDetailsState.status === 'loading'}
    <SkeletonLoader />
  {:else}
    <ResourceViewTitle
      title={resourceType}
      resourceAddress={$page.params.resource}
    />
  {/if}
</Box>

<Box p="large" full>
  <Box transparent flex="row" items="center" justify="between">
    <Text size="xlarge" bold>
      {#if $entityDetailsState.status === 'loading'}
        <SkeletonLoader />
      {:else if !name}
        [NO-NAME]
      {:else}
        {symbol ? symbol : ''}
        {name}
      {/if}
    </Text>
    {#if url}
      <Text color="link" pointer>
        <a href={url}>{url}</a>
      </Text>
    {/if}
  </Box>
  <Box px="none" transparent>
    <Divider />
  </Box>
  <InfoBox {entries} loading={$entityDetailsState.status === 'loading'} />
</Box>
