<script lang="ts">
  import ValidatorList from '@components/validator-list/ValidatorList.svelte'
  import Button from '@components/button/Button.svelte'
  import AddStakePopup from '@components/popup/add-stake-popup/AddStakePopup.svelte'
  import RemoveStakePopup from '@components/popup/remove-stake-popup/RemoveStakePopup.svelte'
  import { selectedAccount } from '@stores'
  import type { Stakes, StakesAPIResponse, Validators } from '@types'
  import { Gateway } from 'radix-js'
  import { MAINNET_URL } from '@constants'
  import { toWholeUnits } from '@utils'
  import { css } from '@styles'

  export let validators: Validators

  let transformedStakes: Stakes
  let selectedValidators: Array<(Validators[0] | undefined)> = []
  let addStakePopupVisible = false
  let removeStakePopupVisible = false

  $: anyValidatorSelected = selectedValidators.some(
    (validator) => validator != undefined
  )

  const showAddStakePopup = () => (addStakePopupVisible = true)
  const showRemoveStakePopup = () => (removeStakePopupVisible = true)

  $: header = css({
    backgroundColor: `${anyValidatorSelected ? '$grey' : null}`,
    height: 50,
    marginBottom: 10,
    paddingTop: 20
  })

  $: (async () => {
    if (!$selectedAccount) return

    const stakesResponse: StakesAPIResponse = await (
      await Gateway.getStakePositions($selectedAccount.address)(MAINNET_URL)
    ).json()

    transformedStakes = {
      stakes: stakesResponse.stakes.reduce((accum, stake) => {
        return {
          ...accum,
          [stake.validator_identifier]: toWholeUnits(stake.value)
        }
      }, {}),
      pendingStakes: stakesResponse.pending_stakes.reduce(
        (accum, pendingStake) => ({
          ...accum,
          [pendingStake.validator_identifier]: toWholeUnits(pendingStake.value)
        }),
        {}
      )
    }
  })()
</script>

<div class={header()}>
  {#if anyValidatorSelected}
    <center>
      <Button on:click={showAddStakePopup}>Add stake</Button>
      <Button on:click={showRemoveStakePopup}>Remove stake</Button>
    </center>
  {/if}
</div>

{#if showAddStakePopup}
  <AddStakePopup />
{/if}
{#if showRemoveStakePopup}
  <RemoveStakePopup />
{/if}

<ValidatorList
  {validators}
  stakes={transformedStakes}
  bind:selectedValidators
/>
