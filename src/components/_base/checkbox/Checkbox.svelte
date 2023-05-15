<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let checked = false

  const dispatch = createEventDispatcher<{
    checked: undefined
    unchecked: undefined
  }>()

  const handleOnClick = () => {
    dispatch(checked ? 'checked' : 'unchecked')
  }
</script>

<div id="wrapper">
  <label id="label">
    <input
      id="checkbox"
      type="checkbox"
      bind:checked
      on:click={handleOnClick}
    />
    <slot />
  </label>
</div>

<style>
  #wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  #label {
    display: flex;
    font-weight: var(--font-weight-bold-2);
    color: var(--label-color);
  }
  #checkbox {
    appearance: none;
    cursor: pointer;
    width: 1rem;
    height: 1rem;
    border: 2px solid var(--color-grey-2);
    border-radius: var(--border-radius-small);
    margin: 0 var(--spacing-sm) 0 0;
    align-self: center;
  }

  #checkbox:checked {
    background: center / contain no-repeat url('/icons/checked-checkbox.svg');
    border: none;
  }
</style>
