<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import OverviewStakeCard from './OverviewStakeCard.svelte'

  export let cardProps: Omit<ComponentProps<OverviewStakeCard>, 'tokenAmount'>
  export let nbrOfValidators: number
  export let stakeAmount: string
  export let tokenAmountDisabled = false
  export let tokenAmountInvalid = false
</script>

<OverviewStakeCard
  {...cardProps}
  bind:tokenAmount={stakeAmount}
  bind:tokenAmountDisabled
  bind:tokenAmountInvalid
>
  <div class="info" slot="info">
    <div class="header">Staking to {nbrOfValidators} Validators</div>
    <div class="text">View Validators and stake amount below</div>
  </div>
</OverviewStakeCard>

<style lang="scss">
  @use '../../../../../mixins.scss';

  .info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);

    .header {
      font-size: var(--text-lg);
    }

    .text {
      color: var(--subtext-color);
    }
  }
</style>
