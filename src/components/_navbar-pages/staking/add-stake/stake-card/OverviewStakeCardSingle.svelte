<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import OverviewStakeCard from './OverviewStakeCard.svelte'
  import ValidatorInfo from './ValidatorInfo.svelte'

  export let cardProps: ComponentProps<OverviewStakeCard>
  export let validatorInfo: ComponentProps<ValidatorInfo>
</script>

<OverviewStakeCard {...cardProps}>
  <svelte:fragment slot="info">
    <ValidatorInfo {...validatorInfo} />
  </svelte:fragment>
</OverviewStakeCard>
