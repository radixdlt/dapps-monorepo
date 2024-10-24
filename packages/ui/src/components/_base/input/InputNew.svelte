<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let value: string
  export let maxlength: number | undefined = undefined
  export let format: (value: string) => string = (value) => value
  export let readonly = false
  export let type = 'text'
  export let border = false
  export let placeholder: string | undefined = undefined

  const dispatch = createEventDispatcher<{
    input: { value: string }
  }>()

  $: {
    value = format(value)
    dispatch('input', { value })
  }
</script>

<input
  {value}
  {type}
  inputmode={type === 'number' ? 'decimal' : 'text'}
  {readonly}
  {maxlength}
  {placeholder}
  on:focus
  on:blur
  on:input={(e) => {
    value = e.currentTarget.value
  }}
  class:border
/>
<slot name="postfix" />

<style>
  input {
    width: var(--input-width, 100%);
    font-size: var(--font-size);
    font-weight: var(--font-weight);
    text-align: var(--text-align);
    color: var(--text-color);
  }

  .border {
    border: 2px solid var(--theme-border);
    padding: var(--spacing-md);
  }
</style>
