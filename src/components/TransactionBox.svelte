<script lang="ts">
    import { box, css } from "@styles"
    import type { Transaction } from "src/types"
    import { fly } from 'svelte/transition';
  
    const shortenAddress = (address: string) =>
      address.slice(0, 5) +
      "..." +
      address.slice(address.length - 4, address.length)
  
    const toWholeUnits = (tokenValue: string) => parseInt(tokenValue) / 10 ** 18
  
    export let tx: Transaction
  
    const grid = css({
      display: "grid",
      gridTemplateColumns: "auto",
      gridAutoRows: "30px",
      gridTemplateAreas: `
        "key value"  
      `
    })
  
    const value = css({
      justifySelf: "end"
    })
  </script>
  
  <div in:fly="{{ y: 200, duration: 500 }}" class={box()}>
    <div class={grid()}>
      <div>status</div>
      <div class={value()}>
        {tx.transaction.transaction_status.status}
      </div>
    
      <div>from</div>
      <div class={value()}>
        {shortenAddress(tx.transaction.actions[0].from_account.address)}
      </div>
    
      <div>to</div>
      <div class={value()}>
        {shortenAddress(tx.transaction.actions[0].to_account.address)}
      </div>
    
      <div>amount</div>
      <div class={value()}>
        {toWholeUnits(tx.transaction.actions[0].amount.value)}
      </div>
    </div>
  </div>
  