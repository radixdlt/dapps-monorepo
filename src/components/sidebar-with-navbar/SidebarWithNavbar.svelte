<script lang="ts">
  import SidebarItem from '@components/sidebar-item/SidebarItem.svelte'
  import Sidebar from '@components/_base/sidebar/Sidebar.svelte'
  import type { Page } from '@sveltejs/kit'
  import { isSameRoute } from '@utils'

  export let page: Page<Record<string, string>> = {} as any // TODO: fix this after storybook gets typesupport

  const routes = [
    { text: 'Staking/Validators', icon: 'validators', path: '/staking' },
    { text: 'Dashboard', icon: 'dashboard', path: '/explorer' },
    { text: 'Package Deployment', icon: 'dashboard', path: '/deploy-package' },
    {
      text: 'Transaction Manifest',
      icon: 'transactions',
      path: '/send-transaction'
    }
  ] as const
</script>

<Sidebar disableClickOutside show>
  {#each routes as route (route.path)}
    <SidebarItem
      icon={route.icon}
      isActive={isSameRoute(route.path, page.routeId ?? '')}
      link={route.path}
      on:click={() => (page.routeId = route.path)}>{route.text}</SidebarItem
    >
  {/each}
</Sidebar>
