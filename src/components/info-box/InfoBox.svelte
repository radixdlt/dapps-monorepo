<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import Text from '@components/_base/text/Text.svelte'

  export let data: Record<string, unknown> | undefined
  export let loading: boolean
  const loaderWidth = 100
</script>

<Box>
  <Box>
    <Box
      gap="medium"
      cx={{
        display: 'grid',
        gridTemplateColumns: '2fr 5fr'
      }}
      transparent
    >
      {#each Object.entries(data || {}) as [key, value]}
        <Text bold>
          {#if loading}
            <SkeletonLoader width={loaderWidth} />
          {:else if data}
            {key}
          {/if}
        </Text>
        <Text>
          {#if loading}
            <SkeletonLoader width={loaderWidth} />
          {:else if data}
            {value}
          {/if}
        </Text>
      {/each}
    </Box>
  </Box>
</Box>
