<script lang="ts">
  import { fly, scale } from 'svelte/transition'
  import CloseIcon from '@icons/cross-2.svg'
  import { showSidebar } from '@stores'
  import { VIEW_PORTS } from '@constants'

  let width: number
  let windowWidth: number

  export let showDesktopSidebar: boolean | undefined

  $: showMobileSidebar = $showSidebar
  $: isDesktopViewport = (windowWidth ?? 0) > VIEW_PORTS.desktop

  $: {
    if (showMobileSidebar && !isDesktopViewport)
      document.body.classList.add('no-scroll')
    else document.body.classList.remove('no-scroll')
  }
</script>

<svelte:window bind:innerWidth={windowWidth} />

{#if showMobileSidebar && !isDesktopViewport}
  <nav
    bind:clientWidth={width}
    transition:fly={{ x: -width, opacity: 1, duration: 300 }}
  >
    <button
      class="close"
      style={`mask-image: url(${CloseIcon}); -webkit-mask-image: url(${CloseIcon});`}
      transition:scale={{ delay: 0, duration: 300 }}
      on:click={() => {
        showSidebar.set(false)
      }}
    />
    <slot />
  </nav>
{:else if isDesktopViewport && showDesktopSidebar}
  <nav>
    <slot />
  </nav>
{/if}

<style lang="scss">
  nav {
    z-index: 2000;
    height: 100%;
    width: calc(100% - 70px);
    border-width: 1px;
    border-color: var(--theme-border);
    background-color: var(--theme-surface-2);
    position: fixed;
    top: 0;

    @include mixins.desktop {
      grid-area: nav;
      position: sticky;
      top: 0px;
      width: auto;
      z-index: unset;
    }
  }

  .close {
    z-index: 2000;
    width: 1.2rem;
    height: 1.2rem;
    margin: 1rem;
    background-color: var(--theme-text-primary);
    mask-repeat: no-repeat;
    mask-position: center;
    mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    -webkit-mask-size: contain;

    &:hover {
      transition: background-color 0.1s ease-in-out;
      background-color: var(--theme-subtext);
    }
    @include mixins.desktop {
      display: none;
    }
  }
</style>
