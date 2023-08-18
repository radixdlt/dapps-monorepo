<script lang="ts">
  import 'cooltipz-css'
  import { addressToRoute, shortenAddress } from '@utils'
  import { onDestroy, onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import CopyableText from '../copyable-text/CopyableText.svelte'

  export let value = ''
  export let short = false
  export let autoShorten = false
  export let preventNavigation = false

  let addressElement: HTMLElement | undefined
  let addressElementMaxWidth = 0

  const handleResize = () => {
    if (addressElementMaxWidth < addressElement?.clientWidth!) {
      const { left } = addressElement!.getBoundingClientRect()
      addressElementMaxWidth = addressElement?.clientWidth! + left
    }
    if (addressElementMaxWidth && addressElement) {
      short = window.innerWidth < addressElementMaxWidth
    }
  }

  const handleAddressClick = () => {
    if (preventNavigation) return

    goto(addressToRoute(value))
  }

  onMount(() => {
    if (autoShorten) {
      window.addEventListener('resize', handleResize)
      handleResize()
    }
  })

  onDestroy(() => {
    window.removeEventListener('resize', handleResize)
  })
</script>

<div class="address" bind:this={addressElement}>
  <CopyableText text={value}>
    <button class="text" on:click|stopPropagation={handleAddressClick}>
      {short ? shortenAddress(value) : value}
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
