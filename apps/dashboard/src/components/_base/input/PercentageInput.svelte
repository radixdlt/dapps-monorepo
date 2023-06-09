<script lang="ts">
  import { number } from '@directives/format-input'
  import InputNew from './InputNew.svelte'
  import type { ComponentProps } from 'svelte'

  export let value: number
  export let inputParams:
    | Omit<ComponentProps<InputNew>, 'formatter' | 'width' | 'value'>
    | undefined = undefined
</script>

<div id="percentage-input">
  <InputNew
    bind:value
    {...inputParams}
    format={number(0, 100)}
    maxlength={3}
    width="3.2rem"
    dir="rtl"
  />
  %
</div>

<style lang="scss">
  #percentage-input {
    display: flex;
    align-items: center;
    font-size: var(--card-value-size);
    font-weight: var(--card-value-weight);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-lg);

    &:hover {
      background-color: var(--color-grey-3);
    }

    transition: background-color 0.3s ease;
  }
</style>
