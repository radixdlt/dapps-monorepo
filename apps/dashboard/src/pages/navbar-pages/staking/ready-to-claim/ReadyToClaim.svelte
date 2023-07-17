<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import { stakeInfo } from '../../../../routes/(navbar-pages)/validators/+layout.svelte'
  import BigNumber from 'bignumber.js'
  import { EXPECTED_EPOCH_TIME_MINUTES } from '@constants'
  import { formatTokenValue } from '@utils'

  export let validatorAddress: string

  const MINUTES_DAY = 60 * 24

  $: nearestClaim = $stakeInfo.then((info) => {
    let nearestClaim = {
      claimEpoch: '-1',
      amount: '0'
    }

    info.unstaking
      .filter((u) => u.validator.address === validatorAddress)
      .forEach((unstake) => {
        if (
          new BigNumber(nearestClaim.claimEpoch).eq(-1) ||
          new BigNumber(unstake.claimEpoch).lt(nearestClaim.claimEpoch)
        ) {
          nearestClaim = {
            claimEpoch: unstake.claimEpoch,
            amount: unstake.xrdAmount
          }
        }
      })

    return {
      amount: nearestClaim.amount,
      days: new BigNumber(nearestClaim.claimEpoch)
        .multipliedBy(EXPECTED_EPOCH_TIME_MINUTES)
        .dividedBy(MINUTES_DAY)
        .toFixed(0)
    }
  })
</script>

{#await nearestClaim}
  <SkeletonLoader />
{:then claim}
  <slot
    name="text"
    amount={formatTokenValue(claim.amount).displayValue}
    days={claim.days}
  />
{/await}
