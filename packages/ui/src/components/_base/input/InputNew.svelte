<script lang="ts">
  import { format as _format } from '@directives/format-input'
  import { createEventDispatcher } from 'svelte'

  export let displayedValue: string
  export let maxlength: number | undefined = undefined
  export let format: (value: string) => string = (value) => value
  export let readonly = false
  export let rtl = false

  const dispatch = createEventDispatcher<{
    input: { value: string }
  }>()
</script>

<input
  type="text"
  dir={rtl ? 'rtl' : 'ltr'}
  {readonly}
  use:_format={format}
  bind:value={displayedValue}
  {maxlength}
  on:input={(e) => {
    dispatch('input', { value: e.currentTarget.value })
  }}
/>
<slot name="postfix" />

<style>
  input {
    width: var(--width);
    font-size: var(--font-size);
    font-weight: var(--font-weight);
    text-align: var(--text-align);
    color: var(--text-color);
  }
</style>
