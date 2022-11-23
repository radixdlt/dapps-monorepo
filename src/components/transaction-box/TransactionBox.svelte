<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import type { TransactionTransformed } from '@io/gateway'

  export let tx: TransactionTransformed | undefined
  export let loading: boolean
  const loaderWidth = 100
</script>

<Box>
  <Box>
    <Box
      cx={{
        display: 'grid',
        gridTemplateColumns: '1fr 5fr'
      }}
      transparent
    >
      <Box transparent>status</Box>
      <Box transparent justify="gridEnd">
        {#if loading}
          <SkeletonLoader width={loaderWidth} />
        {:else if tx}
          {tx.status}
        {/if}
      </Box>
    </Box>
  </Box>
</Box>
