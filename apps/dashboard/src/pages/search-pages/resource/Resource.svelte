<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import Box from '@components/_base/box/Box.svelte'
  import Icon from '@components/_base/icon/Icon.svelte'
  import Card from '@components/_base/card/Card.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import { getStringMetadata } from '@api/utils/resources'
  import type { getEntityDetails } from '@api/gateway'
  import ExternalLinkIcon from '@icons/external.svg'
  import MetadataInfoBox from '@components/metadata-info-box/MetadataInfoBox.svelte'

  export let details: Promise<
    Awaited<ReturnType<typeof getEntityDetails>>[number]
  >

  $: metadata = details.then(({ metadata }) => metadata)

  $: name = metadata.then(getStringMetadata('name'))
  $: symbol = metadata.then(getStringMetadata('symbol'))
  $: url = metadata.then(getStringMetadata('url'))
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
            <Icon icon={ExternalLinkIcon} width="xs" height="xs" />
            <Text ml="small">
              <a href={url} target="_blank">{url}</a>
            </Text>
          </Text>
        {/if}
      {/await}
    </Box>
    <svelte:fragment slot="body">
      <MetadataInfoBox metadata={metadata.then(({ items }) => items)} />
    </svelte:fragment>
  </Card>
  <slot />
</Box>
