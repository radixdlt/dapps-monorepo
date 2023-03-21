<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  type T = $$Generic
  export let inputs: T[]

  const dispatch = createEventDispatcher()
</script>

<div class="stack-list">
  {#each inputs as input, i}
    <div class="input-row">
      <slot {input} {i} />

      <div
        class="remove-button"
        on:click={() => (inputs = inputs.filter((_, j) => j !== i))}
      >
        <slot name="remove-button" />
      </div>
    </div>
  {/each}
  <div on:click={() => dispatch('add')}>
    <slot name="add-button" />
  </div>
</div>

<style>
  .stack-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .input-row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .remove-button {
    margin-left: var(--space-sm);
  }
</style>
