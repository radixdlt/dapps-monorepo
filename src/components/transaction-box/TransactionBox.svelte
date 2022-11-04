<script lang="ts" context="module">
  type Action = {
    from: string
    to: string
    amount: number
  }

  export type Transaction = {
    status: string
    actions: Action[]
  }
</script>

<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import { shortenAddress } from '@utils'

  export let tx: Transaction | undefined
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

      <Box transparent>from</Box>
      <Box justify="gridEnd" transparent>
        {#if loading}
          <SkeletonLoader width={loaderWidth} />
        {:else if tx}
          {shortenAddress(tx.actions[0].from)}
        {/if}
      </Box>

      <Box transparent>to</Box>
      <Box transparent justify="gridEnd">
        {#if loading}
          <SkeletonLoader width={loaderWidth} />
        {:else if tx}
          {shortenAddress(tx.actions[0].to)}
        {/if}
      </Box>

      <Box transparent>amount</Box>
      <Box justify="gridEnd" transparent>
        {#if loading}
          <SkeletonLoader width={loaderWidth} />
        {:else if tx}
          {tx.actions[0].amount}
        {/if}
      </Box>
    </Box>
  </Box>
</Box>
