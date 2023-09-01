<script lang="ts">
  import 'cooltipz-css'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import CopyIcon from '@icons/copy.svg'
  import { copyToClipboard } from '@directives/copy-to-clipboard'
  import { onMount } from 'svelte'

  export let value: string
  export let copyableValue: string = value
  export let shorten:
    | {
        fn: (text: string) => string
        behavior: 'always' | 'responsive'
      }
    | undefined = undefined

  $: short = shorten?.behavior === 'always' ? true : false

  let displayText = value

  $: if (shorten) displayText = short ? shorten.fn(value) : value

  let element: HTMLElement
  let boundingContainer: HTMLElement | undefined

  let resizeToLongThreshold: {
    left: number
    right: number
  } = {
    left: 0,
    right: 0
  }

  const checkOverflow = (child: HTMLElement, ancestor: HTMLElement) => {
    const { left: leftThreshold, right: rightThreshold } =
      child.getBoundingClientRect()

    const { left, right } = ancestor.getBoundingClientRect()

    return left > leftThreshold || right < rightThreshold
  }

  const doesElementOverflow = (element: HTMLElement) => {
    let currentElement: HTMLElement | null = element.parentElement

    if (boundingContainer) {
      return checkOverflow(element, boundingContainer)
    } else {
      while (currentElement) {
        if (checkOverflow(element, currentElement)) {
          boundingContainer = currentElement
          return true
        }
        currentElement = currentElement.parentElement
      }
    }

    return false
  }

  const handleResize = () => {
    if (short) {
      const { left, right } = boundingContainer!.getBoundingClientRect()
      short =
        left > resizeToLongThreshold.left || right < resizeToLongThreshold.right
    } else {
      const overflows = doesElementOverflow(element)
      if (overflows) {
        resizeToLongThreshold = element.getBoundingClientRect()
        short = true
      }
    }
  }

  onMount(() => {
    if (shorten?.behavior === 'responsive') {
      window.addEventListener('resize', handleResize)
      handleResize()
    }

    return () => window.removeEventListener('resize', handleResize)
  })
</script>

<div class="copyable-text" bind:this={element}>
  <div class="text">
    <slot {displayText}>
      {displayText}
    </slot>
  </div>
  <button use:copyToClipboard={copyableValue}>
    <IconNew size="medium" icon={CopyIcon} />
  </button>
</div>

<style>
  .copyable-text {
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
  }

  .text {
    margin-right: var(--spacing-sm);
  }
</style>
