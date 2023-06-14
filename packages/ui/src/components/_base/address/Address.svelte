<script lang="ts">
  import 'cooltipz-css'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import { shortenAddress } from '../../../utils'
  import { onDestroy } from 'svelte'
  import CopyIcon from '@icons/copy.svg'

  export let value = ''
  export let short = false
  export let useBackground = true

  const tooltipTimer = 2_000

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

  onDestroy(() => {
    if (setTimeoutInstance) clearTimeout(setTimeoutInstance)
  })
</script>

<div
  class="address"
  style:background={useBackground ? 'var(--color-grey-5)' : ''}
  style:padding={useBackground ? 'var(--spacing-xs) var(--spacing-sm)' : ''}
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
    <IconNew size="small" icon={CopyIcon} />
  </div>
</div>

<style>
  .address {
    display: inline-flex;
    align-items: center;
    border-radius: var(--border-radius-lg);
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
