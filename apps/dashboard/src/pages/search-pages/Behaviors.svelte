<script lang="ts">
  import CardRow from '@components/info-box/CardRow.svelte'
  import Behavior from '@components/behavior/Behavior.svelte'
  import type { Resource } from '@api/utils/entities/resource'

  export let behaviors: Resource['behaviors']
</script>

<CardRow title="Behavior">
  <div class="cards">
    {#if Array.isArray(behaviors)}
      {#each behaviors as behavior}
        <div class:flex-basis={behaviors.length > 1}>
          <Behavior type={behavior} />
        </div>
      {/each}
    {:else}
      <Behavior type={'simple'} />
    {/if}
  </div>
</CardRow>

<style>
  .cards {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xl);
  }
</style>
