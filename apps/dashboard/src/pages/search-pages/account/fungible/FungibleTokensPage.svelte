<script lang="ts">
  import FungibleTokenCard from '@svelte-ui/components/fungible-token-card/FungibleTokenCard.svelte'
  import type { Token } from '../types'
  import NoTokens from '../NoTokens.svelte'
  import BigNumber from 'bignumber.js'

  export let data: Promise<{
    tokens: Token[]
    xrd: Token | undefined
  }>

  $: filteredData = data.then(({ tokens, xrd }) => ({
    tokens: tokens.filter((token) => new BigNumber(token.amount).gt(0)),
    xrd
  }))
</script>

<div class="tokens">
  {#await filteredData}
    {#each Array(4) as _}
      <FungibleTokenCard loading />
    {/each}
  {:then { tokens, xrd }}
    {#if tokens.length === 0 && !xrd}
      <NoTokens>No fungible tokens found</NoTokens>
    {:else}
      {#if xrd}
        <div class="xrd">
          <FungibleTokenCard
            isXrd
            address={xrd.address}
            linksTo={xrd.linksTo}
            amount={xrd.amount}
            iconUrl={xrd.iconUrl}
            symbol={xrd.symbol}
          />
        </div>
      {/if}

      {#each tokens as token}
        <div class="token">
          <FungibleTokenCard
            address={token.address}
            linksTo={token.linksTo}
            amount={token.amount}
            iconUrl={token.iconUrl}
            symbol={token.symbol}
            numberOfTags={token.numberOfTags}
          />
        </div>
      {/each}
    {/if}
  {/await}
</div>

<style lang="scss">
  .tokens {
    display: grid;
    gap: var(--spacing-2xl);

    @include mixins.desktop {
      grid-template-columns: repeat(2, 1fr);
      .xrd {
        grid-column-start: 1;
        grid-column-end: 3;
      }
    }
  }
</style>
