<script lang="ts">
  import { SkeletonLoader } from '@radixdlt/svelte-skeleton-loader'
  import BigNumber from 'bignumber.js'
  import { formatTokenValue, timeToEpoch } from '@utils'
  import {
    currentEpoch,
    stakeInfo
  } from '../../../../routes/(navbar-pages)/network-staking/(load-validators)/(load-staking-data)/+layout.svelte'

  export let validatorAddress: string

  let accumulatedUnstaking: Promise<{
    amount: string
    timeToClaim: string
  }> = new Promise(() => {})

  $: if ($stakeInfo)
    accumulatedUnstaking = $stakeInfo.then(async (info) => {
      const validatorUnstakes = info.unstaking.filter(
        (u) => u.validator.address === validatorAddress
      )
      const accumulatedUnstaking = validatorUnstakes.reduce(
        (previousValue, currentValue) => {
          const currentXrdAmount = new BigNumber(currentValue.xrdAmount)
          const currentClaimEpoch = new BigNumber(currentValue.claimEpoch)
          return {
            amount: previousValue.amount.plus(currentXrdAmount),
            claimEpoch: previousValue.claimEpoch.gt(currentClaimEpoch)
              ? previousValue.claimEpoch
              : currentClaimEpoch
          }
        },
        { amount: new BigNumber('0'), claimEpoch: new BigNumber('-1') }
      )

      const timeToClaim = timeToEpoch(
        await $currentEpoch,
        parseInt(accumulatedUnstaking.claimEpoch.toString())
      )

      return {
        amount: accumulatedUnstaking.amount.toString(),
        timeToClaim:
          validatorUnstakes.length === 1
            ? timeToClaim
            : timeToClaim.includes('less than')
            ? timeToClaim
            : `${timeToClaim} or less`
      }
    })
</script>

{#await accumulatedUnstaking}
  <SkeletonLoader />
{:then claim}
  <slot name="text" amount={claim.amount} timeToClaimText={claim.timeToClaim} />
{/await}
