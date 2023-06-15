<script lang="ts">
  import Divider from '@components/_base/divider/Divider.svelte'
  import TokenAmountCard from './TokenAmountCard.svelte'

  export let token: {
    name: string
    iconUrl: string
  }
  export let tokenAmount: string = '0'
  export let tokenDisplayedAmount: string = ''
  export let disabled = false
  export let invalid = false
</script>

<div class="token-amount-card">
  <TokenAmountCard
    {token}
    bind:tokenAmount
    bind:tokenDisplayedAmount
    {invalid}
    bind:disabled
  />
  <div
    class="extension"
    class:disabled
    style:background={`${
      invalid ? 'var(--invalid-background-color)' : 'var(--surface)'
    }`}
    style:border-color={`${invalid ? 'var(--invalid-border-color)' : ''}`}
  >
    <Divider
      --spacing="var(--spacing-xs)"
      --color={`${invalid ? 'var(--invalid-border-color)' : ''}`}
    />
    <slot name="undertext" />
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
