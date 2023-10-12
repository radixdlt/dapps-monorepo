<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import PoolUnitCard from '@components/pool-unit-card/PoolUnitCard.svelte'
  import type PoolUnits from './PoolUnits.svelte'

  export let poolUnits: ComponentProps<PoolUnits>['poolData']
</script>

<div class="pool-units">
  {#await poolUnits then poolUnits}
    {#each poolUnits as poolUnit}
      <div class="pool-unit">
        <PoolUnitCard {poolUnit} />
      </div>
    {/each}
  {/await}
</div>

<style>
  .pool-units {
    flex-grow: 1;
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-2xl);
    align-content: flex-start;
    flex-direction: column;
    justify-content: stretch;
  }

  .pool-unit {
    width: 100%;
  }
</style>
