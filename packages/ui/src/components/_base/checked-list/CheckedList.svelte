<script lang="ts">
  import SkeletonLoader from '@components/_base/skeleton-loader/SkeletonLoader.svelte'
  import Checkbox from '../checkbox/Checkbox.svelte'

  type G = $$Generic

  type T = G & { label: string; checked: boolean }

  export let options: T[]
  export let selected: G[] = []
  export let loading = false

  $: selected = options.filter((o) => o.checked)
</script>

<div class="wrapper">
  {#if loading}
    <SkeletonLoader count={5} />
  {/if}

  {#each options as option}
    <Checkbox bind:checked={option.checked}>
      <slot {option}>
        {option.label}
      </slot>
    </Checkbox>
  {/each}
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
</style>
