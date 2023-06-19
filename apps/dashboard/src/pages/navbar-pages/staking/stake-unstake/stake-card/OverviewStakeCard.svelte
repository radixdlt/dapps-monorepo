<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import StakingIcon from '@icons/staking.svg'

  import StakeCard from './StakeCard.svelte'
  import type { ComponentProps } from 'svelte'
  import TokenAmountCard from './token-amount-card/TokenAmountCard.svelte'
  import { formatTokenValue } from '@utils'
  import BigNumber from 'bignumber.js'

  export let tokenInfo: Omit<
    ComponentProps<TokenAmountCard>,
    'tokenAmount' | 'invalid' | 'disabled'
  >
  export let amountToStake: string
  export let tokenAmountDisabled = false
  export let tokenAmountInvalid = false
  export let tokenBalance: string

  let validStakeAmount: boolean

  $: validStakeAmount = new BigNumber(tokenBalance).gte(
    new BigNumber(amountToStake)
  )

  $: tokenAmountInvalid = !validStakeAmount
</script>

<StakeCard>
  <svelte:fragment slot="icon">
    <IconNew icon={StakingIcon} --size="4rem" />
  </svelte:fragment>

  <slot name="info" slot="info" />

  <svelte:fragment slot="token-amount-card">
    <TokenAmountCard
      {...tokenInfo}
      bind:tokenAmount={amountToStake}
      bind:disabled={tokenAmountDisabled}
      bind:invalid={tokenAmountInvalid}
    >
      <div
        slot="footer"
        class="footer subtext"
        class:invalid={tokenAmountInvalid}
      >
        Balance {formatTokenValue(tokenBalance).value}
      </div>
    </TokenAmountCard>
  </svelte:fragment>
</StakeCard>

<style lang="scss">
  @use '../../../../../../../../packages/ui/src/mixins.scss';
  .invalid {
    color: var(--invalid-border-color);
  }
</style>
