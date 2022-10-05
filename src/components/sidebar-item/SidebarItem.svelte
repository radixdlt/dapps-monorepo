<script lang="ts">
  import IconTextItem from '@components/icon-text-item/IconTextItem.svelte'
  import { css } from '@styles'
  import type { icons } from 'src/icon-assets'

  export let isActive = false
  export let icon: keyof typeof icons
  export let isHovered = isActive

  const styles = css({
    borderStyle: 'solid',
    borderWidth: '0',
    borderLeftWidth: '$md',
    borderColor: '$secondary',
    borderRadius: '0',
    cursor: 'pointer'
  })
</script>

<div
  on:mouseenter={() => (isHovered = true)}
  on:mouseleave={() => (isHovered = isActive)}
  class={isHovered ? styles() + ' ' + 'isHovered' : ''}
>
  <IconTextItem bold={isHovered || isActive} {icon}><slot /></IconTextItem>
</div>

<style>
  .isHovered :global(img) {
    filter: grayscale(0);
  }
</style>
