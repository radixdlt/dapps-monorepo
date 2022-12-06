<script lang="ts">
  import SidebarItem from '@components/sidebar-item/SidebarItem.svelte'
  import Sidebar from '@components/_base/sidebar/Sidebar.svelte'
  import type { Page } from '@sveltejs/kit'
  import { isSameRoute } from '@utils'
  import type { icons } from 'src/icon-assets'

  export let page: Page<Record<string, string>> = {} as any // TODO: fix this after storybook gets typesupport

  const routes: Array<{
    text: string
    icon: keyof typeof icons
    path: string
  }> = [
    { text: 'Deploy Package', icon: 'dashboard', path: '/deploy-package' },
    {
      text: 'Transaction Manifest',
      icon: 'transactions',
      path: '/transaction-manifest'
    },
    {
      text: 'Send Tokens',
      icon: 'tokens',
      path: '/send-tokens'
    }
  ]
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
