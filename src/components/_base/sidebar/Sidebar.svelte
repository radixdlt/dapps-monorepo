<script lang="ts">
  import { fly } from 'svelte/transition'
  import { css } from '@styles'
  import { clickOutside } from '@directives/click-outside'

  export let show = false
  export let disableClickOutside = false

  const navStyle = css({
    gridArea: 'nav',
    position: 'sticky',
    height: 'calc(100vh - 100px)',
    top: '100px',
    borderColor: '$borderColor',
    borderWidth: '$sm',
    backgroundColor: '$surface',
    width: '$4xl'
  })

  const onOutsideClick = (_: any) => {
    if (!disableClickOutside) {
      show = false
    }
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
