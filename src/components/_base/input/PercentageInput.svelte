<script lang="ts">
  import { number } from '@directives/format-input'
  import InputNew from './InputNew.svelte'
  import type { ComponentProps } from 'svelte'

  export let value: string
  export let inputParams:
    | Omit<ComponentProps<InputNew>, 'formatter' | 'width' | 'value'>
    | undefined = undefined
</script>

<div class="percentage-input input-box">
  <InputNew
    bind:displayedValue={value}
    {...inputParams}
    format={number('0', '100')}
    maxlength={3}
    --width="3.2rem"
    --font-size="var(--text-3xl)"
    --font-weight="var(--font-weight-bold-2)"
  />
  %
</div>

<style lang="scss">
  @use './shared.scss';

  .percentage-input {
    display: flex;
    align-items: center;
    font-size: var(--text-3xl);
    font-weight: var(--font-weight-bold-2);
  }
</style>
