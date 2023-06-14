<script lang="ts">
  import Divider from '@components/_base/divider/Divider.svelte'
  import BigNumber from 'bignumber.js'
  import { formatTokenValue } from '@utils/format-amount'
  import TokenAmountCard from './TokenAmountCard.svelte'

  export let iconUrl: string
  export let tokenName: string
  export let tokenBalance: string
  export let tokenAmount: string
  export let tokenDisplayedAmount: string = ''
  export let disabled = false
  export let invalid = false

  $: hasEnoughBalance = new BigNumber(tokenBalance).gte(
    new BigNumber(tokenAmount)
  )

  $: invalid = !hasEnoughBalance
</script>

<div class="token-amount-card">
  <TokenAmountCard
    {iconUrl}
    bind:tokenAmount
    bind:tokenDisplayedAmount
    {tokenName}
    invalid={!hasEnoughBalance}
    bind:disabled
  />
  <div
    class="extension"
    class:disabled
    style:background={`${
      !hasEnoughBalance ? 'var(--invalid-background-color)' : 'var(--surface)'
    }`}
    style:border-color={`${
      !hasEnoughBalance ? 'var(--invalid-border-color)' : ''
    }`}
  >
    <Divider
      --spacing="var(--spacing-sm)"
      --color={`${!hasEnoughBalance ? 'var(--invalid-border-color)' : ''}`}
    />
    <div
      style:color={!hasEnoughBalance ? 'var(--invalid-border-color)' : ''}
      class="subtext"
    >
      Balance {formatTokenValue(tokenBalance)}
    </div>
  </div>
</div>

<style lang="scss">
  @use '../../../../../../../../../packages/ui/src/mixins.scss';
  @use './shared.scss';

  .token-amount-card {
    :global(.token-amount-card) {
      border-radius: var(--card-border-radius) var(--card-border-radius) 0 0;
      border-bottom: none;
      padding-bottom: 0;
    }

    .extension {
      background-color: var(--surface);
      padding: var(--card-padding);
      border-radius: 0 0 var(--card-border-radius) var(--card-border-radius);
      border: var(--border);
      border-top: none;
    }
  }
</style>
