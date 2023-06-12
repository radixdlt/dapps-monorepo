<script lang="ts">
  import { format as _format } from '@directives/format-input'

  export let displayedValue: string
  export let maxlength: number | undefined = undefined
  export let format: (value: string) => string = (value) => value
</script>

<input
  type="text"
  use:_format={format}
  bind:value={displayedValue}
  {maxlength}
/>

<style>
  input {
    width: var(--width);
    font-size: var(--font-size);
    font-weight: var(--font-weight);
    text-align: var(--text-align);
    color: var(--text-color);
  }
</style>
