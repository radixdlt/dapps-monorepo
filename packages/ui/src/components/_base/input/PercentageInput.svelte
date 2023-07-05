<script lang="ts">
  import { number } from '@directives/format-input'
  import AmountInput from './AmountInput.svelte'

  export let value: string
</script>

<AmountInput bind:value format={number('0', '100')} --width="6rem" on:input>
  <div class="percentage" slot="postfix">%</div>
</AmountInput>

<style lang="scss">
  .percentage {
    display: inline-block;
    font-size: var(--text-3xl);
    font-weight: var(--font-weight-bold-2);
  }
</style>
