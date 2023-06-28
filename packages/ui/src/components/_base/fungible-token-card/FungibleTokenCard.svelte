<script lang="ts">
  import Address from '@components/_base/address/Address.svelte'
  import Tags from '../tags/Tags.svelte'
  import { formatTokenValue } from '@utils'
  import TokenIcon from '@components/_base/token-icon/TokenIcon.svelte'
  import 'cooltipz-css'

  export let isXrd = false
  export let numberOfTags = 0
  export let address: string | undefined
  export let amount: string | undefined
  export let symbol: string | undefined
  export let iconUrl: string | undefined
  export let linksTo: string | undefined
  export let loading = false

  $: formatted = formatTokenValue(amount ?? '0')
</script>

<a class="card" href={linksTo}>
  <TokenIcon {isXrd} {iconUrl} />
  <div>
    <div class="token-text {isXrd || numberOfTags > 0 ? 'has-tags' : ''}">
      {#if symbol}<span class="token-symbol">{symbol.slice(0, 5)}</span>{/if}
      <Address short value={address} --background="var(--color-grey-5)" />
    </div>

    <Tags showNetworkTag={isXrd} {numberOfTags} />
  </div>
  <div style="text-align: right">
    <button
      on:click|preventDefault|stopPropagation={() => {
        navigator.clipboard.writeText(amount ?? '0')
      }}
      class:cooltipz--top={formatted.suffix}
      class="token-amount"
      aria-label={formatted.value}
      >{formatted.rounded}
      {formatted.suffix}</button
    >
  </div>
</a>

<style lang="scss">
  @use '../../../mixins.scss';

  .card {
    @include mixins.card;
    user-select: none;
    padding: var(--spacing-lg);
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
