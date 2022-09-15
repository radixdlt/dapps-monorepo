<script lang="ts">
  import ValidatorList from '@components/validator-list/ValidatorList.svelte'
  import Button from '@components/_base/button/Button.svelte'
  import { selectedAccount } from '@stores'
  import type { StakesTransformed, ValidatorTransformedArray } from '@types'
  import { toWholeUnits } from '@utils'
  import { css } from '@styles'
  import { stakePositions } from '@gateway'
  import StakePopup from '@components/stake-popup/StakePopup.svelte'
  import type { PageData } from './$types'
  import { StakesIO } from '@io/gateway'

  export let data: PageData

  let transformedStakes: StakesTransformed
  let selectedValidators: ValidatorTransformedArray = []
  let addStakePopupVisible = false
  let removeStakePopupVisible = false

  $: anyValidatorSelected = selectedValidators.some(
    (validator) => validator != undefined
  )

  const toggleAddStakePopup = () =>
    (addStakePopupVisible = !addStakePopupVisible)

  const toggleRemoveStakePopup = () =>
    (removeStakePopupVisible = !removeStakePopupVisible)

  $: header = css({
    backgroundColor: `${anyValidatorSelected ? '$grey' : null}`,
    height: 50,
    marginBottom: 10,
    paddingTop: 20
  })

  $: (async () => {
    if (!$selectedAccount) return

    const stakesResponse = await stakePositions($selectedAccount.address)
    const parsedStakes = StakesIO.parse(stakesResponse)

    transformedStakes = {
      stakes: parsedStakes.stakes.reduce((accum, stake) => {
        return {
          ...accum,
          [stake.validator_identifier]: toWholeUnits(stake.value)
        }
      }, {}),
      pendingStakes: parsedStakes.pending_stakes.reduce(
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
      <Button on:click={toggleAddStakePopup}>Add stake</Button>
      <Button on:click={toggleRemoveStakePopup}>Remove stake</Button>
    </center>
  {/if}
</div>

{#if addStakePopupVisible || removeStakePopupVisible}
  <StakePopup
    validators={selectedValidators}
    onCancel={addStakePopupVisible
      ? toggleAddStakePopup
      : toggleRemoveStakePopup}
    addOrRemove={addStakePopupVisible ? 'add' : 'remove'}
  />
{/if}

<div
  class={css({
    margin: '0 $lg'
  })()}
>
  <ValidatorList
    validators={data.validators}
    stakes={transformedStakes}
    bind:selectedValidators
  />
</div>
