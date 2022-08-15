<script lang="ts">
  import ValidatorBox from '@components/validator-list/ValidatorList.svelte'
  import { selectedAccount } from '@stores'
  import type { Stakes, StakesAPIResponse, Validators } from '@types'
  import { Gateway } from 'radix-js'
  import { MAINNET_URL } from '@constants'
  import { toWholeUnits } from '@utils'

  export let validators: Validators

  let transformedStakes: Stakes

  $: (async () => {
    if (!$selectedAccount) return

    const stakesResponse: StakesAPIResponse = await (
      await Gateway.getStakePositions($selectedAccount.address)(MAINNET_URL)
    ).json()

    transformedStakes = {
      stakes: stakesResponse.stakes.reduce((accum, stake) => {
        console.log(stake.validator_identifier, stake.value)
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

<ValidatorBox {validators} stakes={transformedStakes} />
