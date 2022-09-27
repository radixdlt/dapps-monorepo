<script lang="ts">
  import { fly } from 'svelte/transition'
  import { css } from '@styles'
  import { clickOutside } from '@directives/click-outside'

  export let show = false

  const navStyle = css({
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100%',
    px: '$lg',
    py: '$lg',
    borderColor: '$borderColor',
    borderWidth: '$sm',
    backgroundColor: '$surface',
    overflowY: 'auto',
    width: '$4xl'
  })

  const onOutsideClick = (_: any) => {
    show = false
  }
</script>

{#if show}
  <nav
    use:clickOutside
    on:outside-click={onOutsideClick}
    class={navStyle()}
    transition:fly={{ x: -300, opacity: 1 }}
  >
    <slot />
  </nav>
{/if}
