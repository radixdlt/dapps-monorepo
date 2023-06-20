<script lang="ts">
  import FungibleTokenCard from '@components/_base/fungible-token-card/FungibleTokenCard.svelte'
  import type { Token } from './types'

  export let xrd: Token | undefined = undefined
  export let tokens: Token[] = []
  export let loading = false
</script>

{#if xrd}
  <FungibleTokenCard
    isXrd
    {loading}
    address={xrd.address}
    linksTo={xrd.linksTo}
    amount={xrd.amount}
    iconUrl={xrd.iconUrl}
    symbol={xrd.symbol}
  />
{/if}

<div class="tokens">
  {#each tokens as token}
    <FungibleTokenCard
      {loading}
      address={token.address}
      linksTo={token.linksTo}
      amount={token.amount}
      iconUrl={token.iconUrl}
      symbol={token.symbol}
      numberOfTags={token.numberOfTags}
      --margin="0.8rem 0"
    />
  {/each}
</div>

<style lang="scss">
  .tokens {
    @container (width > 50rem) {
      margin: var(--spacing-xl) 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 2rem;
    }
  }
</style>
