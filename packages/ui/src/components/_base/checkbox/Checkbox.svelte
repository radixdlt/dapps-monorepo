<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import CheckedIcon from '@icons/checked-checkbox.svg'

  export let checked = false

  const dispatch = createEventDispatcher<{
    checked: undefined
    unchecked: undefined
  }>()

  const handleOnClick = () => {
    dispatch(checked ? 'checked' : 'unchecked')
  }
</script>

<div class="wrapper">
  <label class="label">
    <input
      class="checkbox"
      type="checkbox"
      class:checked
      bind:checked
      on:click|stopPropagation={handleOnClick}
      style={checked
        ? `background: center / contain no-repeat url(${CheckedIcon});`
        : ''}
    />
    <slot />
  </label>
</div>

<style lang="scss">
  $border-width: 2px;
  $box-size: 1rem;

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
    width: $box-size;
    height: $box-size;
    border: $border-width solid var(--color-grey-2);
    border-radius: var(--border-radius-sm);
    margin: 0 var(--spacing-sm) 0 0;
    align-self: center;
  }

  .checked {
    border: none;
    width: calc($box-size + $border-width * 2);
    height: calc($box-size + $border-width * 2);
  }
</style>
