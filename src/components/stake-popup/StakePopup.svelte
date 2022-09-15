<script lang="ts">
  import Button from '@components/_base/button/Button.svelte'
  import Popup from '@components/_base/popup/Popup.svelte'
  import { css } from '@styles'
  import type { ValidatorTransformedArray } from '@types'

  export let validators: ValidatorTransformedArray
  export let onCancel: (e: MouseEvent) => void
  export let addOrRemove: 'add' | 'remove'

  const amounts: string[] = []

  const addStake = () => {
    /* TODO
        const tx = Transaction([])
        Wallet.sendTransaction(tx)
      */
    onCancel(null as any) // temp
  }

  const removeStake = () => {
    /* TODO
        const tx = Transaction([])
        Wallet.sendTransaction(tx)
      */
    onCancel(null as any) // temp
  }

  const validatorGrid = css({
    display: 'grid',
    grid: '2fr 1fr / 2fr 1fr',
    gridTemplateRows: 'auto',
    gridColumnGap: '10px',
    gridRowGap: '20px',
    margin: '20px'
  })
</script>

<Popup>
  <div>
    <div class={validatorGrid()}>
      {#each validators as validator, index}
        {validator.name}
        <input
          placeholder="Enter amount to stake"
          type="number"
          bind:value={amounts[index]}
        />
      {/each}
    </div>
    <center>
      <Button on:click={onCancel}>Cancel</Button>
      <Button on:click={addOrRemove === 'add' ? addStake : removeStake}>
        {addOrRemove === 'add' ? 'Add Stake' : 'Remove Stake'}
      </Button>
    </center>
  </div>
</Popup>
