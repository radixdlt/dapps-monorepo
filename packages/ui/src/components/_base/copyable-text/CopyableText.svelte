<script lang="ts">
  import 'cooltipz-css'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import CopyIcon from '@icons/copy.svg'
  import { copyToClipboard } from '@directives/copy-to-clipboard'
  import { onMount } from 'svelte'

  export let value: string
  export let shorten:
    | {
        fn: (text: string) => string
        behavior: 'always' | 'responsive'
      }
    | undefined = undefined

  $: short = shorten?.behavior === 'always' ? true : false

  let displayText = value

  $: if (shorten) displayText = short ? shorten.fn(value) : value

  let element: HTMLElement | undefined
  let elementMaxWidth = 0

  const handleResize = () => {
    if (elementMaxWidth < element?.clientWidth!) {
      const { left } = element!.getBoundingClientRect()
      elementMaxWidth = element?.clientWidth! + left
    }
    if (elementMaxWidth && element) {
      short = window.innerWidth < elementMaxWidth
    }
  }

  onMount(() => {
    if (shorten?.behavior === 'responsive') {
      console.log('got here')
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
  <button use:copyToClipboard={value}>
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
