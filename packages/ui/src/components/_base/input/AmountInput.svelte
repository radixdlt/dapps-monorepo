<script lang="ts">
  import InputNew from './InputNew.svelte'
  import { createEventDispatcher } from 'svelte'
  import { removeThousandsSeparator } from '@utils/format-amount'
  import { formatTokenValue } from '@utils'

  export let value: string
  export let maxlength: number | undefined = undefined
  export let readonly = false
  export let format = readonly
    ? (value: string) => formatTokenValue(value, undefined).displayValue
    : (x: string) => x

  const dispatch = createEventDispatcher<{ input: { value: string } }>()
  const onFocus = (ev: any) => {
    if (ev.target.value == 0) {
      dispatch('input', { value: '' })
    }
  }

  const onBlur = (ev: any) => {
    if (ev.target.value == 0) {
      dispatch('input', { value: '0' })
    }
  }
</script>

<div class="input-box" class:no-hover={readonly} class:editable={!readonly}>
  <InputNew
    type="number"
    {value}
    on:focus={onFocus}
    on:blur={onBlur}
    {maxlength}
    {readonly}
    {format}
    --font-size="var(--text-xl)"
    --font-weight="var(--font-weight-bold-2)"
    --text-align="right"
    on:input={(e) => {
      dispatch('input', { value: removeThousandsSeparator(e.detail.value) })
    }}
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
