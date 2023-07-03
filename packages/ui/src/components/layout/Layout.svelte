<script lang="ts">
  import Header from '@components/header/Header.svelte'
  import SidebarWithNavbar from '../sidebar-with-navbar/SidebarWithNavbar.svelte'
  import { page } from '$app/stores'

  export let routes: { text: string; icon: string; path: string }[] = []

  let scrollOffset: number
</script>

<svelte:window bind:scrollY={scrollOffset} />

<div class="layout">
  <div class="header">
    <Header />
  </div>
  <div class="content">
    <div class="navbar" style:top={`${scrollOffset}px`}>
      <SidebarWithNavbar page={$page} {routes} />
    </div>
    <main class="page">
      <slot />
    </main>
  </div>
</div>

<style lang="scss">
  @use '../../mixins.scss';
  .layout {
    display: grid;
    grid:
      'header'
      'content';
    height: 100vh;
    width: 100vw;

    .header {
      grid-area: header;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .content {
      grid-area: content;
      display: grid;
      grid: 'page';
      height: 100%;
      position: relative;
      overflow: hidden;

      @include mixins.desktop {
        grid: 'navbar page' auto / 16rem auto;
      }

      .navbar {
        grid-area: navbar;
        position: absolute;
      }

      .page {
        grid-area: page;
        background: var(--theme-surface-1);
        padding-bottom: var(--spacing-lg);
        min-height: calc(100vh - 100px);
        overflow-y: scroll;
      }
    }
  }
</style>
