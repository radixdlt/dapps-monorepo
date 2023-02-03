<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Icon from '@components/_base/icon/Icon.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import type { PageData } from './$types'
  import { query } from '@queries'

  export let data: PageData

  $: resourceAddress = data.resourceAddress

  $: ({ state: entityDetailsState } = query(
    'getEntityDetails',
    resourceAddress,
    {
      manual: false
    }
  ))

  $: entries = [
    {
      key: 'Description',
      value: $entityDetailsState.data?.metadata.items.find(
        (item) => item.key.toLowerCase() === 'description'
      )?.value
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

  $: resourceType = $entityDetailsState.data?.details?.discriminator
    ? {
        fungible_resource: 'Fungible Resource',
        non_fungible_resource: 'Non Fungible Resource',
        package: 'Package',
        component: 'Component'
      }[$entityDetailsState.data?.details.discriminator]
    : ''
</script>

<Box>
  {#if $entityDetailsState.status === 'loading'}
    <SkeletonLoader />
  {:else}
    <ResourceViewTitle title={resourceType} {resourceAddress} />
  {/if}
</Box>

<Box>
  <Card>
    <Box bgColor="surface" wrapper slot="header" flex="row" items="center">
      <Text size="large" bold>
        {#if $entityDetailsState.status === 'loading'}
          <SkeletonLoader />
        {:else if !name}
          [NO-NAME]
        {:else}
          {name}
          {symbol ? `(${symbol})` : ''}
        {/if}
      </Text>
      {#if url}
        <Text color="link" ml="auto" pointer items="center">
          <Icon type="external" width="xs" height="xs" />
          <Text ml="small">
            <a href={url} target="_blank">{url}</a>
          </Text>
        </Text>
      {/if}
    </Box>
    <InfoBox
      slot="body"
      {entries}
      loading={$entityDetailsState.status === 'loading'}
    >
      <Text align="right" bold slot="key" let:entry>
        {entry.key}
      </Text>
    </InfoBox>
  </Card>
</Box>
