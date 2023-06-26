<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import StakingIcon from '@icons/staking.svg'
  import StakeCard from './StakeCard.svelte'
  import TokenAmountCard from './token-amount-card/TokenAmountCard.svelte'
  import { formatTokenValue } from '@utils'
  import BigNumber from 'bignumber.js'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import type { ComponentProps } from 'svelte'

  export let amountToStake: string
  export let tokenAmountDisabled = false
  export let tokenAmountInvalid = false
  export let xrdBalance: Promise<string>
  export let token: ComponentProps<TokenAmountCard>['token']

  let validStakeAmount: boolean

  $: xrdBalance.then((balance) => {
    validStakeAmount = new BigNumber(balance).gte(new BigNumber(amountToStake))
  })

  $: tokenAmountInvalid = !validStakeAmount
</script>

<StakeCard>
  <svelte:fragment slot="icon">
    <IconNew icon={StakingIcon} --size="4rem" />
  </svelte:fragment>

  <slot name="info" slot="info" />

  <svelte:fragment slot="token-amount-card">
    <TokenAmountCard
      {token}
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
          Balance {formatTokenValue(balance).value}
        {/await}
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
