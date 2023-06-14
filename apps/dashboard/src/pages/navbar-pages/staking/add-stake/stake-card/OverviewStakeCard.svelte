<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import StakingIcon from '@icons/staking.svg'

  import StakeCard from './StakeCard.svelte'
  import TokenAmountCardWithBalance from './token-amount-card/TokenAmountCardWithBalance.svelte'
  import type { ComponentProps } from 'svelte'

  export let tokenInfo: Omit<
    ComponentProps<TokenAmountCardWithBalance>,
    'tokenAmount'
  >
  export let tokenAmount: string
  export let tokenAmountDisabled = false
  export let tokenAmountInvalid = false
</script>

<StakeCard>
  <svelte:fragment slot="icon">
    <IconNew icon={StakingIcon} --size="4rem" />
  </svelte:fragment>

  <slot name="info" slot="info" />

  <svelte:fragment slot="token-amount-card">
    <TokenAmountCardWithBalance
      {...tokenInfo}
      bind:tokenAmount
      bind:disabled={tokenAmountDisabled}
      bind:invalid={tokenAmountInvalid}
    />
  </svelte:fragment>
</StakeCard>
