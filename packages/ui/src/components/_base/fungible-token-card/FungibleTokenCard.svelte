<script>
  import Address from '@components/_base/address/Address.svelte'
  import Tags from './Tags.svelte'
  import { formatTokenValue } from '@utils'
  import TokenIcon from '@components/_base/token-icon/TokenIcon.svelte'
  import 'cooltipz-css'

  export let showNetworkTag = false
  export let numberOfTags = 0
  export let address = ''
  export let amount = ''
  export let symbol = ''
  export let iconUrl = ''
  export let linksTo = ''

  $: formatted = formatTokenValue(amount)
</script>

<a class="card" href={linksTo}>
  <TokenIcon {iconUrl} />
  <div>
    <div class="token-text">
      <span class="token-symbol">{symbol.slice(0, 5)}</span>
      <Address short value={address} />
    </div>

    <Tags {showNetworkTag} {numberOfTags} />
  </div>
  <div style="text-align: right">
    <button
      on:click|preventDefault|stopPropagation={() => {
        navigator.clipboard.writeText(amount)
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
    &:hover {
      transform: var(--transform-hover-card);
      box-shadow: var(--shadow-hover);
    }
  }

  .token-text {
    display: flex;
    flex-wrap: wrap;
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
