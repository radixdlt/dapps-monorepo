<script lang="ts">
  import { format as _format } from '@directives/format-input'
  import { createEventDispatcher } from 'svelte'

  export let value: string
  export let maxlength: number | undefined = undefined
  export let format: (value: string) => string = (value) => value
  export let readonly = false

  let blockValueChange = false
  let _value: typeof value

  // this prevents the input value from being set after the on:input event fires and formatting to be bypassed
  const setValue = (v: typeof value) => {
    if (blockValueChange) return
    _value = v
    blockValueChange = false
  }

  $: setValue(value)

  const dispatch = createEventDispatcher<{
    input: { value: string }
  }>()
</script>

<input
  value={_value}
  type="text"
  {readonly}
  use:_format={format}
  {maxlength}
  on:input={(e) => {
    blockValueChange = true
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
