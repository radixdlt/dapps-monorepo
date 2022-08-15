<script lang="ts">
  import ValidatorList from '@components/validator-list/ValidatorList.svelte'
  import { selectedAccount } from '@stores'
  import type { Stakes, StakesAPIResponse, Validators } from '@types'
  import { Gateway } from 'radix-js'
  import { MAINNET_URL } from '@constants'
  import { toWholeUnits } from '@utils'
  import { css } from '@styles'

  export let validators: Validators

  let transformedStakes: Stakes

  let anyValidatorSelected: boolean

  const header = css({
    backgroundColor: '$grey',
    position: 'absolute',
    height: 50
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

{#if anyValidatorSelected}
  <div class={header()} />
{/if}

<ValidatorList
  {validators}
  stakes={transformedStakes}
  bind:anyValidatorSelected
/>
