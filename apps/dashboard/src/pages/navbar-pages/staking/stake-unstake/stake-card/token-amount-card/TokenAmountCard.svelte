<script lang="ts">
  import AmountInput from '@components/_base/input/AmountInput.svelte'

  export let token: {
    name: string
    iconUrl: string
  }
  export let tokenAmount: string = '0'
  export let tokenDisplayedAmount: string = '0'
  export let invalid: boolean
  export let disabled: boolean
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
      <img src={token.iconUrl} alt="bitcoin" />
      {token.name}
    </div>

    <AmountInput
      bind:displayedValue={tokenDisplayedAmount}
      bind:value={tokenAmount}
      --width="14rem"
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
      gap: var(--spacing-lg);

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
