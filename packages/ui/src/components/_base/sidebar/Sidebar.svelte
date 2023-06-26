<script lang="ts">
  import { fly, scale } from 'svelte/transition'
  import CloseIcon from '@icons/cross-2.svg'
  import { showSidebar } from '@stores'
  import { VIEW_PORTS } from '@constants'

  let width: number
  let windowWidth: number

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
  <button
    class="close"
    style={`mask-image: url(${CloseIcon}); -webkit-mask-image: url(${CloseIcon});`}
    transition:scale={{ delay: 0, duration: 300 }}
    on:click={() => {
      showSidebar.set(false)
    }}
  />

  <nav
    bind:clientWidth={width}
    transition:fly={{ x: -width, opacity: 1, duration: 300 }}
  >
    <slot />
  </nav>
{:else if isDesktopViewport}
  <nav>
    <slot />
  </nav>
{/if}

<style lang="scss">
  @use '../../../mixins.scss';

  nav {
    position: fixed;
    z-index: 2000;
    height: 100%;
    width: calc(100% - 70px);
    border-width: 1px;
    border-color: var(--theme-border);
    background-color: var(--theme-surface-2);

    @include mixins.desktop {
      grid-area: nav;
      position: sticky;
      height: calc(100vh - 100px);
      top: 100px;
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
    position: fixed;
    right: 0;
    &:hover {
      transition: background-color 0.1s ease-in-out;
      background-color: var(--theme-subtext);
    }
    @include mixins.desktop {
      display: none;
    }
  }

  :global(body.no-scroll) {
    overflow: hidden !important;
    @include mixins.desktop {
      overflow: auto;
    }
  }
</style>
