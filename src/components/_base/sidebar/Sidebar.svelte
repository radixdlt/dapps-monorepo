<script lang="ts">
  import { fly } from 'svelte/transition'
  import { css } from '@styles'
  import { clickOutside } from '@directives/click-outside'

  export let show = false
  export let disableClickOutside = false

  const navStyle = css({
    gridArea: 'nav',
    py: '$lg',
    borderColor: '$borderColor',
    borderWidth: '$sm',
    backgroundColor: '$surface',
    overflowY: 'auto',
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
