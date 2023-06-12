<script lang="ts">
  import { number } from '@directives/format-input'
  import InputNew from './InputNew.svelte'
  import type { ComponentProps } from 'svelte'
  import { removeThousandsSeparator } from '../../../utils/format-amount'

  export let displayedValue: string = ''
  export let inputParams:
    | Omit<ComponentProps<InputNew>, 'formatter' | 'width' | 'value'>
    | undefined = undefined

  export let value = '0'

  $: value = removeThousandsSeparator(displayedValue)
</script>

<div class="input-box">
  <InputNew
    bind:displayedValue
    {...inputParams}
    format={number(undefined, undefined, 10)}
    --font-size="var(--text-3xl)"
    --font-weight="var(--font-weight-bold-2)"
    --text-align="right"
  />
</div>

<style lang="scss">
  @use './shared.scss';
</style>
