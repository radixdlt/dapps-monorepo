<script lang="ts">
  import IconNew from '@components/_base/icon/IconNew.svelte'

  import StakeCard from './StakeCard.svelte'
  import TokenAmountCardWithBalance from './token-amount-card/TokenAmountCardWithBalance.svelte'
  import type { ComponentProps } from 'svelte'

  export let rightColumnWidth: string
  export let tokenInfo: ComponentProps<TokenAmountCardWithBalance>
</script>

<StakeCard --token-amount-card-width={rightColumnWidth}>
  <svelte:fragment slot="icon">
    <IconNew type="staking" --size="4rem" />
  </svelte:fragment>

  <slot name="info" slot="info" />

  <svelte:fragment slot="token-amount-card">
    <TokenAmountCardWithBalance on:invalid {...tokenInfo} />
  </svelte:fragment>
</StakeCard>
