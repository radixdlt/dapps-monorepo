<script lang="ts">
  import ValidatorList from '@components/validator-list/ValidatorList.svelte'
  import Button from '@components/button/Button.svelte'
  import { currentPage, selectedAccount } from '@stores'
  import type { Stakes, Validators } from '@types'
  import { toWholeUnits } from '@utils'
  import { css } from '@styles'
  import { stakePositions } from '@gateway'
  import StakePopup from '@components/popup/stake-popup/StakePopup.svelte'
  import type { PageData } from './$types'

  export let data: PageData

  currentPage.set('staking')

  let transformedStakes: Stakes
  let selectedValidators: Array<Validators[0]> = []
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
