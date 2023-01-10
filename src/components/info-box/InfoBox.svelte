<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import Text from '@components/_base/text/Text.svelte'

  type T = $$Generic

  export let entries: Array<T & { key: string; value?: unknown }> = []
  export let transparent: boolean = false
  export let loading: boolean = false

  const loaderWidth = 100
</script>

<Box bgColor={transparent ? undefined : 'surface'}>
  <Box
    gap="medium"
    cx={{
      display: 'grid',
      gridTemplateColumns: 'auto 5fr'
    }}
    bgColor={transparent ? undefined : 'surface'}
  >
    {#each entries as entry}
      <Box justify="end" wrapper>
        <slot name="key" {entry}>
          <Text bold>
            {entry.key}
          </Text>
        </slot>
      </Box>

      {#if loading}
        <SkeletonLoader width={loaderWidth} />
      {:else}
        <slot name="value" {entry}>
          <Text>
            {entry.value === undefined ? `<no value>` : entry.value}
          </Text>
        </slot>
      {/if}
    {/each}
  </Box>
</Box>
