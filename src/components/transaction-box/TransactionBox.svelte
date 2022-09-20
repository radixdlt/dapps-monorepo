<script lang="ts">
  import Box from '@components/_base/box/Box.svelte'
  import { shortenAddress } from '@utils'
  import type { Transaction } from 'src/routes/explorer/transaction/[transaction]/+page.server'

  export let tx: Transaction
</script>

<Box>
  <Box inFly={{ y: 200, duration: 500 }}>
    <Box
      cx={{
        display: 'grid',
        gridTemplateColumns: 'auto',
        gridAutoRows: '30px',
        gridTemplateAreas: `
          "key value"  
        `
      }}
      transparent
    >
      <Box transparent>status</Box>
      <Box
        transparent
        cx={{
          justifySelf: 'end'
        }}
      >
        {tx.status}
      </Box>

      <Box transparent>from</Box>
      <Box
        cx={{
          justifySelf: 'end'
        }}
        transparent
      >
        {shortenAddress(tx.actions[0].from)}
      </Box>

      <Box transparent>to</Box>
      <Box
        transparent
        cx={{
          justifySelf: 'end'
        }}
      >
        {shortenAddress(tx.actions[0].to)}
      </Box>

      <Box transparent>amount</Box>
      <Box
        cx={{
          justifySelf: 'end'
        }}
        transparent
      >
        {tx.actions[0].amount}
      </Box>
    </Box>
  </Box>
</Box>
