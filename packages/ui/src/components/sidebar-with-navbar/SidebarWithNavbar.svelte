<script lang="ts">
  import SidebarItem from '@components/sidebar-item/SidebarItem.svelte'
  import Sidebar from '@components/_base/sidebar/Sidebar.svelte'
  import type { Page } from '@sveltejs/kit'
  import { isSameRoute } from '../../utils'

  export let page: Page
  export let showDesktopSidebar: boolean | undefined

  export let routes: {
    text: string
    icon: string
    path: string
  }[] = []
</script>

<Sidebar {showDesktopSidebar}>
  <div class="sidebar-wrapper">
    <div class="menu-items">
      {#each routes as route (route.path)}
        <SidebarItem
          icon={route.icon}
          isActive={isSameRoute(route.path, page.route?.id ?? '')}
          link={route.path}>{route.text}</SidebarItem
        >
      {/each}
    </div>
    <div class="links">
      <a href="https://www.radixdlt.com/privacy-policy" target="_blank"
        >Privacy Notice</a
      >
    </div>
  </div>
</Sidebar>

<style lang="scss">
  @use '../../mixins.scss';

  .sidebar-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
  }

  .menu-items {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-top: var(--spacing-xl);
    gap: var(--spacing-xl);
  }
  .links {
    padding: 2rem 1.5rem;
    margin: 0 1rem;
    border-top: 1px solid var(--theme-border);
    a {
      font-weight: 400;
      color: var(--theme-subtext);
      font-size: var(--text-sm);
      &:hover {
        transition: opacity ease-in-out 0.1s;
        opacity: 0.8;
      }
    }
  }
</style>
