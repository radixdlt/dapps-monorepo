<script lang="ts">
  import 'cooltipz-css'
  import { addressToRoute, shortenAddress } from '@utils'
  import { goto } from '$app/navigation'
  import CopyableText from '../copyable-text/CopyableText.svelte'

  export let value = ''
  export let short = false
  export let autoShorten = false
  export let preventNavigation = false

  const handleAddressClick = async () => {
    if (preventNavigation) return

    goto(await addressToRoute(value))
  }
</script>

<div class="address">
  <CopyableText
    {value}
    shorten={short || autoShorten
      ? {
          fn: shortenAddress,
          behavior: autoShorten ? 'responsive' : 'always'
        }
      : undefined}
    let:displayText
  >
    <button class="text" on:click|stopPropagation={handleAddressClick}>
      {displayText}
    </button>
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
    }
  }
</style>
