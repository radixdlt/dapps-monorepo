<script lang="ts">
  import Header from '@components/header/Header.svelte'
  import SidebarWithNavbar from '../sidebar-with-navbar/SidebarWithNavbar.svelte'
  import { page } from '$app/stores'

  export let routes: { text: string; icon: string; path: string }[] = []
</script>

<div class="layout">
  <Header />
  <SidebarWithNavbar page={$page} {routes} />
  <main>
    <slot />
  </main>
</div>

<style lang="scss">
  @use '../../mixins.scss';
  .layout {
    display: grid;
    grid-template-columns: 250px auto;
    grid-template-rows: auto auto;

    grid-template-areas:
      'header header'
      'content content';

    @include mixins.desktop {
      grid-template-areas:
        'header header'
        'nav content';
    }
  }
  main {
    grid-area: content;
    background: var(--theme-surface-1);
    padding-bottom: var(--spacing-lg);
    min-height: calc(100vh - 100px);
  }
</style>
