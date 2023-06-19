<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import OverviewStakeCard from './OverviewStakeCard.svelte'
  import ValidatorInfo from './ValidatorInfo.svelte'

  export let cardProps: Omit<
    ComponentProps<OverviewStakeCard>,
    'amountToStake' | 'tokenAmountInvalid'
  >
  export let validatorInfo: ComponentProps<ValidatorInfo>
  export let stakeAmount: string
  export let tokenAmountInvalid: boolean
</script>

<OverviewStakeCard
  {...cardProps}
  bind:amountToStake={stakeAmount}
  bind:tokenAmountInvalid
>
  <svelte:fragment slot="info">
    <ValidatorInfo {...validatorInfo} />
  </svelte:fragment>
</OverviewStakeCard>
