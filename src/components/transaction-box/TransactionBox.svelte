<script lang="ts">
  import Box from '@components/box/Box.svelte'
  import { shortenAddress } from '@utils'
  import type { Transaction } from 'src/routes/explorer/transaction/[transaction]/+page.server'
  import { fly } from 'svelte/transition'
  import { grid, value } from './styles'

  export let tx: Transaction
</script>

<Box>
  <div in:fly={{ y: 200, duration: 500 }}>
    <div class={grid}>
      <div>status</div>
      <div class={value}>
        {tx.status}
      </div>

      <div>from</div>
      <div class={value}>
        {shortenAddress(tx.actions[0].from)}
      </div>

      <div>to</div>
      <div class={value}>
        {shortenAddress(tx.actions[0].to)}
      </div>

      <div>amount</div>
      <div class={value}>
        {tx.actions[0].amount}
      </div>
    </div>
  </div>
</Box>
