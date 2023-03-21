<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import InfoBox from '@components/info-box/InfoBox.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Icon from '@components/_base/icon/Icon.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import Row from '@components/info-box/Row.svelte'
  import { getStringMetadata } from '@api/utils/resources'
  import type { getEntityDetails } from '@api/gateway'

  export let details: ReturnType<typeof getEntityDetails>

  $: metadata = details.then(({ metadata }) => metadata)

  $: name = metadata.then(getStringMetadata('name'))
  $: symbol = metadata.then(getStringMetadata('symbol'))
  $: url = metadata.then(getStringMetadata('url'))
  $: description = metadata.then(getStringMetadata('description'))
</script>

<Box>
  <Card>
    <Box bgColor="surface" wrapper slot="header" flex="row" items="center">
      <Text size="large" bold>
        {#await Promise.all([name, symbol])}
          <SkeletonLoader />
        {:then [name, symbol]}
          {#if !name}
            [NO-NAME]
          {:else}
            {name}
            {symbol ? `(${symbol})` : ''}
          {/if}
        {/await}
      </Text>
      {#await url then url}
        {#if url}
          <Text color="link" ml="auto" pointer items="center">
            <Icon type="external" width="xs" height="xs" />
            <Text ml="small">
              <a href={url} target="_blank">{url}</a>
            </Text>
          </Text>
        {/if}
      {/await}
    </Box>
    <InfoBox slot="body">
      <Row>
        <Text slot="left" align="right" bold>Description</Text>
        <Box slot="right" wrapper>
          {#await description}
            <SkeletonLoader />
          {:then description}
            {description}
          {/await}
        </Box>
      </Row>

      {#await metadata}
        <SkeletonLoader />
      {:then _metadata}
        {#each _metadata.items.filter((item) => !['description', 'symbol', 'name', 'url'].some((key) => key === item.key)) ?? [] as metadata}
          <Row>
            <Text slot="left" align="right" bold>{metadata.key}</Text>
            <Text slot="right" align="right" bold
              >{metadata.value.as_string}</Text
            >
          </Row>
        {/each}
      {/await}
    </InfoBox>
  </Card>
  <slot />
</Box>
