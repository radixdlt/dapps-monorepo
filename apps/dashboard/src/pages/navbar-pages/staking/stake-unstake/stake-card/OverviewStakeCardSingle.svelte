<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import OverviewStakeCard from './OverviewStakeCard.svelte'
  import ValidatorInfo from './ValidatorInfo.svelte'

  export let xrdBalance: Promise<string>
  export let validator: ComponentProps<ValidatorInfo>
  export let stakeAmount: string
  export let tokenAmountInvalid: boolean
</script>

<OverviewStakeCard
  {xrdBalance}
  bind:amountToStake={stakeAmount}
  bind:tokenAmountInvalid
>
  <svelte:fragment slot="info">
    <ValidatorInfo {...validator} />
  </svelte:fragment>
</OverviewStakeCard>
