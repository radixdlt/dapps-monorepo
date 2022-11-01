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
  import { shortenAddress } from '@utils'

  export let tx: Transaction
</script>

<Box>
  <Box>
    <Box
      grid="auto"
      cx={{
        display: 'grid',
        gridTemplateAreas: `
          "key value"  
        `
      }}
      transparent
    >
      <Box transparent>status</Box>
      <Box transparent justify="gridEnd">
        {tx.status}
      </Box>

      <Box transparent>from</Box>
      <Box justify="gridEnd" transparent>
        {shortenAddress(tx.actions[0].from)}
      </Box>

      <Box transparent>to</Box>
      <Box transparent justify="gridEnd">
        {shortenAddress(tx.actions[0].to)}
      </Box>

      <Box transparent>amount</Box>
      <Box justify="gridEnd" transparent>
        {tx.actions[0].amount}
      </Box>
    </Box>
  </Box>
</Box>
