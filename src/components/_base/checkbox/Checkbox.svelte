<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import { css } from '@styles'

  type G = $$Generic

  type T = G & { label: string; checked: boolean }

  export let options: T[]
  export let selected: G[] = []
  export let loading = false

  $: selected = options.filter((o) => o.checked)

  const inputStyle = css({
    appearance: 'none',
    width: '$xs',
    height: '$xs',
    border: '0.1em solid $muted',
    marginRight: '$sm',
    marginTop: '$md',
    transform: 'translateY(0.15em)',
    '&:checked': {
      backgroundColor: '$secondary'
    }
  })()
</script>

<div class="wrapper">
  {#if loading}
    <SkeletonLoader count={5} />
  {/if}

  {#each options as option}
    <label class="label">
      <input
        class="checkbox"
        type="checkbox"
        bind:checked={option.checked}
        value={option}
      />
      <slot {option}>
        {option.label}
      </slot>
    </label>
  {/each}
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  .label {
    display: flex;
    font-weight: var(--font-weight-bold-2);
    color: var(--label-color);
  }
  .checkbox {
    appearance: none;
    cursor: pointer;
    width: 1rem;
    height: 1rem;
    border: 2px solid var(--color-grey-2);
    border-radius: var(--border-radius-small);
    margin: 0 var(--spacing-sm) 0 0;
    align-self: center;
  }

  .checkbox:checked {
    background: center / contain no-repeat url('/icons/checked-checkbox.svg');
    border: none;
  }
</style>
