<script lang="ts">
  import { SkeletonLoader } from '@radixdlt/svelte-skeleton-loader'
  import BigNumber from 'bignumber.js'
  import { formatTokenValue, timeToEpoch } from '@utils'
  import {
    currentEpoch,
    stakeInfo
  } from '../../../../routes/(navbar-pages)/network-staking/(load-validators)/(load-staking-data)/+layout.svelte'

  export let validatorAddress: string

  let nearestClaim: Promise<{
    amount: string
    timeToClaim: string
  }> = new Promise(() => {})

  $: if ($stakeInfo)
    nearestClaim = $stakeInfo.then(async (info) => {
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
        timeToClaim: timeToEpoch(
          await $currentEpoch,
          parseInt(nearestClaim.claimEpoch)
        )
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
