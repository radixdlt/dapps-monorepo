<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Icon from '@components/_base/icon/Icon.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import type { PageData } from './$types'
  import { query } from '@api/query'

  export let data: PageData

  $: resourceAddress = data.resourceAddress

  $: ({ send, response, loading } = query('getEntityDetails'))

  $: send(resourceAddress)

  $: entries = [
    {
      key: 'Description',
      value: $response?.metadata.items.find(
        (item) => item.key.toLowerCase() === 'description'
      )?.value
    },
    ...($response?.metadata.items.filter(
      (item) =>
        !['description', 'symbol', 'name', 'url'].some(
          (key) => key === item.key.toLowerCase()
        )
    ) ?? [])
  ]

  $: symbol = $response?.metadata.items.find(
    (item) => item.key.toLowerCase() === 'symbol'
  )?.value

  $: name = $response?.metadata.items.find(
    (item) => item.key.toLowerCase() === 'name'
  )?.value

  $: url = $response?.metadata.items.find(
    (item) => item.key.toLowerCase() === 'url'
  )?.value

  $: resourceType = $response?.details?.discriminator
    ? {
        fungible_resource: 'Fungible Resource',
        non_fungible_resource: 'Non Fungible Resource',
        package: 'Package',
        component: 'Component'
      }[$response?.details.discriminator]
    : ''
</script>

<Box>
  {#if $loading}
    <SkeletonLoader />
  {:else}
    <ResourceViewTitle title={resourceType} {resourceAddress} />
  {/if}
</Box>

<Box>
  <Card>
    <Box bgColor="surface" wrapper slot="header" flex="row" items="center">
      <Text size="large" bold>
        {#if $loading}
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
    <InfoBox slot="body" {entries} loading={$loading}>
      <Text align="right" bold slot="key" let:entry>
        {entry.key}
      </Text>
    </InfoBox>
  </Card>
</Box>
