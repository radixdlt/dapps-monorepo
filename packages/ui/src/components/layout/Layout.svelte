<script lang="ts">
  import Header from '@components/header/Header.svelte'
  import SidebarWithNavbar from '../sidebar-with-navbar/SidebarWithNavbar.svelte'
  import { page } from '$app/stores'
  import { hideHeader } from '@directives/hide-header'
  export let routes: { text: string; icon: string; path: string }[] = []
  export let hideSearch: boolean | undefined = undefined
  export let isTestnet: boolean | undefined = undefined
  export let showDesktopSidebar: boolean | undefined = undefined

  let scrollOffset: number
</script>

<svelte:window bind:scrollY={scrollOffset} />
<div class="layout collapsed" class:isTestnet use:hideHeader>
  <div class="header">
    <Header {showDesktopSidebar} {routes} {hideSearch}
      ><slot slot="logo" name="logo" /></Header
    >
  </div>
  <div class="content" class:has-sidebar={showDesktopSidebar}>
    <div class="navbar" style:top={`${scrollOffset}px`}>
      <SidebarWithNavbar page={$page} {routes} {showDesktopSidebar} />
    </div>

    <main class="page">
      <div class="margin">
        <div class="page-content">
          <slot />
        </div>
      </div>
    </main>
  </div>
</div>

<style lang="scss">
  .layout {
    @include mixins.desktop {
      display: grid;
    }

    height: 100%;
    width: 100vw;

    grid-template-areas:
      'header'
      'content';
    grid-template-rows: 100px 1fr;

    @include mixins.desktop {
      grid-template-rows: 4.6875rem auto;
    }

    @include mixins.mobile {
      transition: grid-template-rows 250ms ease;
      &.collapsed {
        grid-template-rows: 0 1fr;

        .header {
          transform: translateY(-110px);
        }

        &.isTestnet .header {
          transform: translateY(-150px);
        }
      }
    }

    .header {
      transition: transform 250ms ease;
      grid-area: header;
      z-index: 100;
      @include mixins.mobile {
        position: fixed;
        width: 100%;
      }
    }

    .content {
      grid-area: content;
      display: grid;
      grid: 'page';
      height: 100%;
      position: relative;
      overflow: hidden;

      &.has-sidebar {
        @include mixins.desktop {
          grid: 'navbar page' auto / 11rem auto;
        }
      }

      .navbar {
        grid-area: navbar;
        position: absolute;
        height: 100%;
      }

      @include mixins.desktop {
        .page {
          min-height: calc(100vh - 100px);
          padding-bottom: 0;

          .margin {
            margin: 0 var(--spacing-2xl);
          }
        }
      }

      .page {
        grid-area: page;
        background: var(--theme-surface-1);
        padding-bottom: var(--spacing-lg);
        overflow-y: scroll;

        .page-content {
          max-width: 80rem;
          margin: 0 auto;
          padding: var(--spacing-md);
          @include mixins.mobile {
            padding-top: var(--layout-page-content-padding-top, 110px);
          }
          @include mixins.desktop {
            padding: var(--spacing-2xl);
          }
        }
      }
    }
  }
</style>
