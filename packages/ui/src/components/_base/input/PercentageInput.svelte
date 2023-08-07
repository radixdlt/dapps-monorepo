<script lang="ts">
  import { number } from '@directives/format-input'
  import AmountInput from './AmountInput.svelte'
  import { createEventDispatcher } from 'svelte'

  export let value: number

  const dispatch = createEventDispatcher<{ input: { value: number } }>()
</script>

<AmountInput
  value={value.toString()}
  format={number('0', '100')}
  --input-width="3rem"
  on:input={(e) => {
    value = parseFloat(e.detail.value)
    dispatch('input', { value })
  }}
>
  <div class="percentage" slot="postfix">%</div>
</AmountInput>

<style lang="scss">
  .percentage {
    display: inline-block;
    font-size: var(--text-xl);
    font-weight: var(--font-weight-bold-2);
  }
</style>
