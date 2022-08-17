<script lang="ts">
  import { box, css } from '@styles'
  import { shortenAddress } from '@utils'
  import type { Transaction } from 'src/routes/explorer/transaction/[transaction]'
  import { fly } from 'svelte/transition'

  export let tx: Transaction

  const grid = css({
    display: 'grid',
    gridTemplateColumns: 'auto',
    gridAutoRows: '30px',
    gridTemplateAreas: `
        "key value"  
      `
  })

  const value = css({
    justifySelf: 'end'
  })
</script>

<div in:fly={{ y: 200, duration: 500 }} class={box()}>
  <div class={grid()}>
    <div>status</div>
    <div class={value()}>
      {tx.status}
    </div>

    <div>from</div>
    <div class={value()}>
      {shortenAddress(tx.actions[0].from)}
    </div>

    <div>to</div>
    <div class={value()}>
      {shortenAddress(tx.actions[0].to)}
    </div>

    <div>amount</div>
    <div class={value()}>
      {tx.actions[0].amount}
    </div>
  </div>
</div>
