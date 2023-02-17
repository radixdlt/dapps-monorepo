<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import ResourceViewTitle from '@components/resource-view-title/ResourceViewTitle.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Icon from '@components/_base/icon/Icon.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { query } from '@api/query'
  import Row from '@components/info-box/Row.svelte'

  export let address: string

  $: ({ send, response, loading } = query('getEntityDetails'))

  $: send(address)

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
    <ResourceViewTitle title={resourceType} resourceAddress={address} />
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
    <InfoBox slot="body">
      <Row>
        <Text slot="left" align="right" bold>Description</Text>
        <Box slot="right" wrapper>
          {#if $response}
            {$response.metadata.items.find(
              (item) => item.key.toLowerCase() === 'description'
            )?.value}
          {:else}
            <SkeletonLoader />
          {/if}
        </Box>
      </Row>

      {#each $response?.metadata.items.filter((item) => !['description', 'symbol', 'name', 'url'].some((key) => key === item.key.toLowerCase())) ?? [] as metadata}
        <Row>
          <Text slot="left" align="right" bold>{metadata.key}</Text>
          <Text slot="right" align="right" bold>{metadata.value}</Text>
        </Row>
      {/each}
    </InfoBox>
  </Card>
</Box>
