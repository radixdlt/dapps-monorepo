<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import Text from '@components/_base/text/Text.svelte'

  export let keys: string[]
  export let values: unknown[] = []
  export let unknownMetadata: Array<{
    key: string
    value: string
  }> = []

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
      {#each keys as key, i}
        <Text bold>
          {key}
        </Text>

        {#if loading}
          <SkeletonLoader width={loaderWidth} />
        {:else if values[i]}
          <Text>
            {values[i]}
          </Text>
        {:else}
          <Text>
            {`<no value>`}
          </Text>
        {/if}
      {/each}

      {#each unknownMetadata as { key, value }}
        <Text bold>
          {key}
        </Text>
        <Text>
          {#if loading}
            <SkeletonLoader width={loaderWidth} />
          {:else if value}
            <Text>
              {value}
            </Text>
          {:else}
            <Text>
              {`<no value>`}
            </Text>
          {/if}
        </Text>
      {/each}
    </Box>
  </Box>
</Box>
