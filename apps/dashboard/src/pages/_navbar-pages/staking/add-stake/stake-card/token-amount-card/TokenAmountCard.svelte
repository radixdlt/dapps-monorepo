<script lang="ts">
  import AmountInput from '@components/_base/input/AmountInput.svelte'

  export let iconUrl: string
  export let tokenName: string
  export let tokenAmount: string
  export let tokenDisplayedAmount: string
  export let invalid: boolean
  export let disabled: boolean = false
</script>

<div
  class="token-amount-card"
  class:disabled
  style:background={`${
    invalid ? 'var(--invalid-background-color)' : 'var(--surface)'
  }`}
  style:border-color={`${invalid ? 'var(--invalid-border-color)' : ''}`}
>
  <div class="token-amount">
    <div class="name">
      <img src={iconUrl} alt="bitcoin" />
      {tokenName}
    </div>

    <AmountInput
      bind:displayedValue={tokenDisplayedAmount}
      bind:value={tokenAmount}
      --width="15rem"
      --text-color={`${invalid ? 'var(--invalid-border-color)' : ''}`}
    />
  </div>
</div>

<style lang="scss">
  @use '../../../../../../../../../packages/ui/src/mixins.scss';
  @use './shared.scss';

  .token-amount-card {
    padding: var(--card-padding);
    border-radius: var(--card-border-radius);
    border: var(--border);

    .token-amount {
      display: flex;
      justify-content: space-between;

      .name {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        font-weight: var(--font-weight-bold-2);

        img {
          width: 1.5rem;
          height: 1.5rem;
        }
      }
    }
  }
</style>
