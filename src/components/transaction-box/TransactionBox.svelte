<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import { shortenAddress } from '@utils'
  import type { Transaction } from 'src/routes/explorer/transaction/[transaction]/+page.svelte'

  export let tx: Promise<Transaction>

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
        {#await tx}
          <SkeletonLoader width={loaderWidth} />
        {:then tx}
          {tx.status}
        {/await}
      </Box>

      <Box transparent>from</Box>
      <Box justify="gridEnd" transparent>
        {#await tx}
          <SkeletonLoader width={loaderWidth} />
        {:then tx}
          {shortenAddress(tx.actions[0].from)}
        {/await}
      </Box>

      <Box transparent>to</Box>
      <Box transparent justify="gridEnd">
        {#await tx}
          <SkeletonLoader width={loaderWidth} />
        {:then tx}
          {shortenAddress(tx.actions[0].to)}
        {/await}
      </Box>

      <Box transparent>amount</Box>
      <Box justify="gridEnd" transparent>
        {#await tx}
          <SkeletonLoader width={loaderWidth} />
        {:then tx}
          {tx.actions[0].amount}
        {/await}
      </Box>
    </Box>
  </Box>
</Box>
