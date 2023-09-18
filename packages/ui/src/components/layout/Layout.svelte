<script lang="ts">
  import Header from '@components/header/Header.svelte'
  import SidebarWithNavbar from '../sidebar-with-navbar/SidebarWithNavbar.svelte'
  import { page } from '$app/stores'

  export let routes: { text: string; icon: string; path: string }[] = []
  export let hideSearch: boolean | undefined

  let sidebarWidth: number

  let scrollOffset: number
</script>

<svelte:window bind:scrollY={scrollOffset} />

<div class="layout">
  <div class="header">
    <Header {hideSearch}><slot slot="logo" name="logo" /></Header>
  </div>
  <div class="content">
    <div
      class="navbar"
      style:top={`${scrollOffset}px`}
      bind:clientWidth={sidebarWidth}
    >
      <SidebarWithNavbar page={$page} {routes} />
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
  @use '../../mixins.scss';
  .layout {
    display: grid;
    height: 100%;
    width: 100vw;

    grid-template-areas:
      'header'
      'content';
    grid-template-rows: 151px 1fr;

    @include mixins.desktop {
      grid-template-rows: unset;
    }

    @include mixins.desktop {
      grid-template-rows: 4.6875rem auto;
    }

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
        grid: 'navbar page' auto / 11rem auto;
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
          padding: var(--spacing-xl) var(--spacing-2xl);
        }
      }
    }
  }
</style>
