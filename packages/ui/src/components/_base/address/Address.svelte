<script lang="ts">
  import 'cooltipz-css'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import { shortenAddress } from '@utils'
  import { onDestroy, onMount } from 'svelte'
  import CopyIcon from '@icons/copy.svg'

  export let value = ''
  export let short = false
  export let useBackground = true
  export let autoShorten = false

  const tooltipTimer = 2_000
  let addressElement: HTMLElement | undefined
  let addressElementMaxWidth = 0

  let showTooltip = false
  const showTooltipClassNames = ['cooltipz--top', 'cooltipz--visible'].join(' ')

  let setTimeoutInstance: ReturnType<typeof setTimeout>

  const handleCopyClick = (event: MouseEvent) => {
    event.stopPropagation()
    event.preventDefault()
    showTooltip = true
    navigator.clipboard.writeText(value)
    if (setTimeoutInstance) clearTimeout(setTimeoutInstance)

    setTimeoutInstance = setTimeout(() => {
      showTooltip = false
    }, tooltipTimer)
  }

  const handleResize = () => {
    if (addressElementMaxWidth < addressElement?.clientWidth!) {
      const { left } = addressElement!.getBoundingClientRect()
      addressElementMaxWidth = addressElement?.clientWidth! + left
    }
    if (addressElementMaxWidth && addressElement) {
      short = window.innerWidth < addressElementMaxWidth
    }
  }

  onMount(() => {
    if (autoShorten) {
      window.addEventListener('resize', handleResize)
      handleResize()
    }
  })

  onDestroy(() => {
    if (setTimeoutInstance) clearTimeout(setTimeoutInstance)
    window.removeEventListener('resize', handleResize)
  })
</script>

<div
  class="address"
  style:background={useBackground ? 'var(--background)' : ''}
  style:padding={useBackground ? 'var(--spacing-xs) var(--spacing-sm)' : ''}
  bind:this={addressElement}
>
  <!-- svelte-ignore a11y-missing-attribute -->
  <button class="text" on:click>
    {short ? shortenAddress(value) : value}
  </button>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    aria-label="Copied!"
    class={`${showTooltip ? showTooltipClassNames : ''} tooltip-wrapper`}
    on:click={handleCopyClick}
  >
    <IconNew size="medium" icon={CopyIcon} />
  </div>
</div>

<style>
  .address {
    display: inline-flex;
    align-items: center;
    border-radius: var(--border-radius-lg);
    align-self: flex-start;
  }

  .text {
    font-weight: var(--font-weight-bold-1);
    margin-right: var(--spacing-sm);
    color: var(--color-radix-blue-2);
  }
  .tooltip-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
</style>
