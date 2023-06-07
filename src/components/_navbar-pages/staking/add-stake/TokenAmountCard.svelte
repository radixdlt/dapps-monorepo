<script lang="ts">
  import Divider from '@components/_base/divider/Divider.svelte'
  import AmountInput from '@components/_base/input/AmountInput.svelte'

  export let iconUrl: string
  export let tokenName: string
  export let tokenBalance: number
  export let tokenAmount: number

  $: hasEnoughBalance = tokenBalance >= tokenAmount
</script>

<div class="token-amount-card" class:invalid-box={!hasEnoughBalance}>
  <div class="token-amount">
    <div class="name">
      <img
        src="https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579"
        alt="bitcoin"
      />
      {tokenName}
    </div>

    <AmountInput
      bind:value={tokenAmount}
      --width="15rem"
      --text-color={`${!hasEnoughBalance ? 'var(--error-dark)' : ''}`}
    />
  </div>

  <Divider
    --spacing="var(--spacing-md)"
    --color={`${!hasEnoughBalance ? 'var(--error-dark)' : ''}`}
  />

  <div class:invalid-text={!hasEnoughBalance} class="subtext">
    Balance {tokenBalance}
  </div>
</div>

<style lang="scss">
  @use '../../../../mixins.scss';

  .token-amount-card {
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--border-radius-xl);
    border: var(--border);
    background-color: var(--surface);

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

  .invalid-box {
    background-color: var(--error-light);
    border-color: var(--error-dark);
  }

  .invalid-text {
    color: var(--error-dark);
  }
</style>
