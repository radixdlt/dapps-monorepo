<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import OverviewStakeCard from './OverviewStakeCard.svelte'

  export let nbrOfValidators: number
  export let amountToStake: string
  export let tokenAmountDisabled = false
  export let tokenAmountInvalid = false
  export let xrdBalance: ComponentProps<OverviewStakeCard>['xrdBalance']
</script>

<OverviewStakeCard
  {xrdBalance}
  bind:amountToStake
  bind:tokenAmountDisabled
  bind:tokenAmountInvalid
>
  <div class="info" slot="info">
    <div class="header">Staking to {nbrOfValidators} Validators</div>
    <div class="text">Individual amounts below</div>
  </div>
</OverviewStakeCard>

<style lang="scss">
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
