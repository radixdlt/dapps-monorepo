<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import StakingIcon from '@icons/staking.svg'
  import StakeCard from './StakeCard.svelte'
  import TokenAmountCard from './token-amount-card/TokenAmountCard.svelte'
  import { formatTokenValue } from '@utils'
  import BigNumber from 'bignumber.js'
  import { SkeletonLoader } from '@radixdlt/svelte-skeleton-loader'
  import { XRDToken } from '@constants'
  import Popover from '@components/_base/popover/Popover.svelte'
  import FeeWarning from '@components/_base/popover/FeeWarning.svelte'

  export let amountToStake: string
  export let tokenAmountDisabled = false
  export let tokenAmountInvalid = false
  export let xrdBalance: Promise<string>

  let validStakeAmount: boolean

  $: xrdBalance.then((balance) => {
    validStakeAmount = new BigNumber(balance).gte(new BigNumber(amountToStake))
  })

  $: tokenAmountInvalid = !validStakeAmount

  let displayFeeWarning = false

  $: {
    amountToStake
    ;(async () => {
      const balance = await xrdBalance
      const diff = new BigNumber(balance).minus(new BigNumber(amountToStake))
      if (diff.isPositive() && diff.lt(10)) {
        displayFeeWarning = true
      } else {
        displayFeeWarning = false
      }
    })()
  }
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<StakeCard>
  <svelte:fragment slot="icon">
    <IconNew icon={StakingIcon} --size="3rem" />
  </svelte:fragment>

  <slot name="info" slot="info" />

  <svelte:fragment slot="token-amount-card">
    <Popover placement="top" bind:show={displayFeeWarning}>
      <div>
        <TokenAmountCard
          token={XRDToken}
          bind:tokenAmount={amountToStake}
          bind:disabled={tokenAmountDisabled}
          bind:invalid={tokenAmountInvalid}
        >
          <div
            slot="footer"
            class="footer subtext"
            class:invalid={tokenAmountInvalid}
          >
            {#await xrdBalance}
              <SkeletonLoader />
            {:then balance}
              Balance {formatTokenValue(balance).displayValue}
            {/await}
          </div>
        </TokenAmountCard>
      </div>

      <svelte:fragment slot="content">
        <FeeWarning />
      </svelte:fragment>
    </Popover>
  </svelte:fragment>
</StakeCard>

<style lang="scss">
  .invalid {
    color: var(--invalid-border-color);
  }
</style>
