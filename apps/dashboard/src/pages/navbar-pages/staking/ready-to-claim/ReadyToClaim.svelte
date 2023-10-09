<script lang="ts">
  import { SkeletonLoader } from '@radixdlt/svelte-skeleton-loader'
  import BigNumber from 'bignumber.js'
  import { EXPECTED_EPOCH_TIME_MINUTES } from '@constants'
  import { formatTokenValue } from '@utils'
  import {
    currentEpoch,
    stakeInfo
  } from '../../../../routes/(navbar-pages)/network-staking/(load-validators)/(load-staking-data)/+layout.svelte'

  export let validatorAddress: string

  const MINUTES_HOUR = 60
  const HOURS_DAY = 24
  const MINUTES_DAY = MINUTES_HOUR * HOURS_DAY

  const timeToClaim = async (claimEpoch: string) => {
    const diff = new BigNumber(claimEpoch).minus(await $currentEpoch)
    const daysToClaim = diff
      .multipliedBy(EXPECTED_EPOCH_TIME_MINUTES)
      .dividedBy(MINUTES_DAY)

    if (daysToClaim.isLessThan(1)) {
      const hoursToClaim = daysToClaim.multipliedBy(HOURS_DAY)

      if (hoursToClaim.isLessThan(1)) {
        const minutesToClaim = hoursToClaim.multipliedBy(MINUTES_HOUR)

        if (minutesToClaim.lt(EXPECTED_EPOCH_TIME_MINUTES)) {
          return `less than ${EXPECTED_EPOCH_TIME_MINUTES} minutes`
        }
        return `${minutesToClaim.toFixed(0)} minutes`
      }
      return `${hoursToClaim.toFixed(0)} hours`
    }
    return `${daysToClaim.toFixed(0)} days`
  }

  let nearestClaim: Promise<{
    amount: string
    timeToClaim: string
  }> = new Promise(() => {})

  $: if ($stakeInfo)
    nearestClaim = $stakeInfo.then(async (info) => {
      console.log('stakeInfo', info)
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

      console.log('amount', nearestClaim.amount)

      return {
        amount: nearestClaim.amount,
        timeToClaim: await timeToClaim(nearestClaim.claimEpoch)
      }
    })
</script>

{#await nearestClaim}
  <SkeletonLoader />
{:then claim}
  <slot
    name="text"
    amount={formatTokenValue(claim.amount).displayValue}
    timeToClaimText={claim.timeToClaim}
  />
{/await}
