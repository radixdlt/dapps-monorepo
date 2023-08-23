<script lang="ts">
  import Address from '@components/_base/address/Address.svelte'
  import Tags from '../_base/tags/Tags.svelte'
  import { formatTokenValue } from '@utils'
  import TokenIcon from '@components/_base/token-icon/TokenIcon.svelte'
  import 'cooltipz-css'
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'

  export let isXrd = false
  export let numberOfTags = 0
  export let address: string | undefined = undefined
  export let amount: string | undefined = undefined
  export let symbol: string | undefined = undefined
  export let iconUrl: string | undefined = undefined
  export let linksTo: string | undefined = undefined
  export let loading = false

  $: formatted = formatTokenValue(amount ?? '0')
</script>

<a class="card" href={linksTo}>
  <TokenIcon {isXrd} {iconUrl} />
  <div>
    <div class:has-tags={isXrd || numberOfTags > 0} class="token-text">
      {#if symbol}
        <span class="token-symbol">{symbol.slice(0, 5)}</span>
      {/if}

      {#if address}
        <Address short value={address} --background="var(--color-grey-5)" />
      {:else if loading}
        <SkeletonLoader width={200} height={20} />
      {/if}
    </div>

    <Tags showNetworkTag={isXrd} {numberOfTags} />
  </div>
  <div style="text-align: right">
    {#if amount}
      <button
        on:click|preventDefault|stopPropagation={() => {
          navigator.clipboard.writeText(amount ?? '0')
        }}
        class:cooltipz--top={formatted.suffix}
        class="token-amount"
        aria-label={formatted.value}>{formatted.displayValue}</button
      >
    {:else if loading}
      <SkeletonLoader width={100} height={20} />
    {/if}
  </div>
</a>

<style lang="scss">
  @use '../../mixins.scss';

  .card {
    @include mixins.card;
    user-select: none;
    padding: var(--spacing-xl);
    display: grid;
    grid-template-columns: 44px 1fr 1fr;
    grid-gap: var(--spacing-md);
    align-items: center;
    transition: var(--transition-hover-card);
    min-height: 90px;
    container-type: inline-size;
    margin: var(--margin);
    &:hover {
      transform: var(--transform-hover-card);
      box-shadow: var(--shadow-hover);
    }
  }

  .token-text {
    display: flex;
    flex-wrap: wrap;

    &.has-tags {
      margin-bottom: var(--spacing-sm);
    }
  }

  .token-symbol {
    font-weight: var(--font-weight-bold-2);
    margin-right: var(--spacing-sm);
    align-self: center;
  }

  .token-amount {
    text-align: right;
    align-items: center;
    font-size: var(--text-lg);
  }
</style>
