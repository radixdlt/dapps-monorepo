<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import OverviewStakeCard from './OverviewStakeCard.svelte'

  export let cardProps: Omit<
    ComponentProps<OverviewStakeCard>,
    'amountToStake' | 'invalid'
  >
  export let nbrOfValidators: number
  export let amountToStake: string
  export let tokenAmountDisabled = false
  export let tokenAmountInvalid = false
</script>

<OverviewStakeCard
  {...cardProps}
  bind:amountToStake
  bind:tokenAmountDisabled
  bind:tokenAmountInvalid
>
  <div class="info" slot="info">
    <div class="header">Staking to {nbrOfValidators} Validators</div>
    <div class="text">View Validators and stake amount below</div>
  </div>
</OverviewStakeCard>

<style lang="scss">
  @use '../../../../../../../../packages/ui/src/mixins.scss';

  .info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);

    .header {
      font-size: var(--text-lg);
    }

    .text {
      color: var(--theme-subtext);
    }
  }
</style>
