<script lang="ts">
  import { number } from '@directives/format-input'
  import InputNew from './InputNew.svelte'

  export let value: string
  export let maxlength: number | undefined = undefined
  export let readonly = false
  export let format = number(undefined, undefined, 10).bind(null)
</script>

<div class="input-box" class:no-hover={readonly} class:editable={!readonly}>
  <InputNew
    displayedValue={value}
    {maxlength}
    {readonly}
    {format}
    --font-size="var(--text-3xl)"
    --font-weight="var(--font-weight-bold-2)"
    --text-align="right"
    on:input
  >
    <slot name="postfix" slot="postfix" />
  </InputNew>
</div>

<style lang="scss">
  .no-hover {
    pointer-events: none;
  }

  .input-box {
    padding: var(--spacing-sm);
    border-radius: var(--border-radius-lg);
    transition: background-color 0.3s ease;
  }

  .editable {
    background: var(--theme-surface-2);
  }
</style>
