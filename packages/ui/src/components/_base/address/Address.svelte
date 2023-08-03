<script lang="ts">
  import 'cooltipz-css'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import { addressToRoute, shortenAddress } from '@utils'
  import { onDestroy, onMount } from 'svelte'
  import CopyIcon from '@icons/copy.svg'
  import { copyToClipboard } from '@directives/copy-to-clipboard'
  import { goto } from '$app/navigation'

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
  <!-- svelte-ignore a11y-missing-attribute -->
  <button class="text" on:click|stopPropagation={handleAddressClick}>
    {short ? shortenAddress(value) : value}
  </button>
  <button use:copyToClipboard={value}>
    <IconNew size="medium" icon={CopyIcon} />
  </button>
</div>

<style>
  .address {
    display: inline-flex;
    align-items: center;
    background: var(--background);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius-lg);
  }

  .text {
    margin-right: var(--spacing-sm);
    color: var(--color-radix-blue-2);
  }
</style>
