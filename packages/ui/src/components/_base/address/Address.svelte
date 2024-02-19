<script lang="ts">
  import 'cooltipz-css'
  import { addressToRoute, shortenAddress } from '@utils'
  import CopyableText from '../copyable-text/CopyableText.svelte'
  import { writable } from 'svelte/store'
  import { CURRENT_NETWORK } from '@networks'
  import { RadixNetworkConfigById } from '@common/gateway-sdk'

  export let value = ''
  export let short = false
  export let autoShorten = false
  export let preventNavigation = false
  export let includeDashboardHost = false
  export let maxNftIdLength = 18

  const currentDashboardUrl =
    RadixNetworkConfigById[CURRENT_NETWORK.id].dashboardUrl
  let href = writable('')

  $: {
    addressToRoute(value).then((route) => {
      href.set(includeDashboardHost ? `${currentDashboardUrl}${route}` : route)
    })
  }
</script>

<div class="address">
  <CopyableText
    {value}
    shorten={short || autoShorten
      ? {
          fn: (address) => shortenAddress(address, maxNftIdLength),
          behavior: autoShorten ? 'responsive' : 'always'
        }
      : undefined}
    let:displayText
  >
    {#if preventNavigation}
      <button class="text normal-cursor">
        {displayText}
      </button>
    {:else}
      <a href={$href} class="text">{displayText}</a>
    {/if}
  </CopyableText>
</div>

<style lang="scss">
  .address {
    padding: var(--spacing-xs) var(--spacing-sm);
    background: var(--background);
    width: fit-content;
    border-radius: var(--border-radius-lg);

    .text {
      color: var(--color-radix-blue-2);
      font-weight: var(--font-weight-light);
    }

    .normal-cursor {
      cursor: default;
    }
  }
</style>
