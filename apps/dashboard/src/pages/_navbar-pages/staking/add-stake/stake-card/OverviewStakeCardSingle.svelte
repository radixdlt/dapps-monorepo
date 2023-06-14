<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import OverviewStakeCard from './OverviewStakeCard.svelte'
  import ValidatorInfo from './ValidatorInfo.svelte'

  export let cardProps: Omit<ComponentProps<OverviewStakeCard>, 'tokenAmount'>
  export let validatorInfo: ComponentProps<ValidatorInfo>
  export let stakeAmount: string
</script>

<OverviewStakeCard {...cardProps} bind:tokenAmount={stakeAmount}>
  <svelte:fragment slot="info">
    <ValidatorInfo {...validatorInfo} />
  </svelte:fragment>
</OverviewStakeCard>
