<script lang="ts">
  import { number } from '@directives/format-input'
  import InputNew from './InputNew.svelte'
  import { createEventDispatcher } from 'svelte'
  import { removeThousandsSeparator } from '@utils/format-amount'
  import { RET_DECIMAL_PRECISION } from '@constants'

  export let value: string
  export let maxlength: number | undefined = undefined
  export let readonly = false
  export let format: undefined | ((value: string) => string) = undefined

  let numberFormatting = number.bind(
    null,
    undefined,
    undefined,
    10,
    RET_DECIMAL_PRECISION
  )

  let isFocused = false

  const dispatch = createEventDispatcher<{ input: { value: string } }>()
</script>

<div class="input-box" class:no-hover={readonly} class:editable={!readonly}>
  <InputNew
    {value}
    {maxlength}
    {readonly}
    format={format ?? numberFormatting(isFocused ? true : false).bind(null)}
    on:focus={() => {
      isFocused = true
    }}
    on:blur={() => {
      isFocused = false
    }}
    --font-size="var(--text-3xl)"
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
