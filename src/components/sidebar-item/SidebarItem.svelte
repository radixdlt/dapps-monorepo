<script lang="ts">
  import IconTextItem from '@components/icon-text-item/IconTextItem.svelte'
  import { css } from '@styles'
  import type { icons } from 'src/icon-assets'

  export let isActive = false
  export let icon: keyof typeof icons
  export let isHovered = isActive
  export let link: string

  const styles = css({
    borderStyle: 'solid',
    borderWidth: '0',
    borderLeftWidth: '$md',
    borderLeftColor: 'transparent',
    borderRadius: '0',
    cursor: 'pointer',
    '&.isHovered': {
      borderLeftWidth: '$md',
      borderLeftColor: '$secondary'
    }
  })
</script>

<div
  on:mouseenter={() => (isHovered = true)}
  on:mouseleave={() => (isHovered = false)}
  class={styles() + (isHovered || isActive ? ' isHovered' : '')}
>
  <a href={link}
    ><IconTextItem bold={isHovered || isActive} {icon}><slot /></IconTextItem
    ></a
  >
</div>

<style>
  .isHovered :global(img) {
    filter: grayscale(0);
  }
</style>
