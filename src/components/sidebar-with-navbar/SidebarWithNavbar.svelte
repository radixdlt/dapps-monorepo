<script lang="ts">
  import SidebarItem from '@components/sidebar-item/SidebarItem.svelte'
  import Sidebar from '@components/_base/sidebar/Sidebar.svelte'
  import type { Page } from '@sveltejs/kit'
  import { isSameRoute } from '@utils'
  import { featureFlags } from '@featureFlags'
  import type { icons } from '../../../src/icon-assets'

  export let page: Page<Record<string, string>> = {} as any // TODO: fix this after storybook gets typesupport

  const routes: Array<{
    text: string
    icon: keyof typeof icons
    path: string
    isVisible?: boolean
  }> = [
    {
      text: 'Deploy Package',
      icon: 'dashboard',
      path: '/deploy-package',
      isVisible: featureFlags().getFlag('deploy-package')?.enabled
    },
    {
      text: 'Transaction Manifest',
      icon: 'transactions',
      path: '/transaction-manifest',
      isVisible: featureFlags().getFlag('transaction-manifest')?.enabled
    },
    {
      text: 'Send Tokens',
      icon: 'tokens',
      path: '/send-tokens',
      isVisible: featureFlags().getFlag('send-tokens')?.enabled
    }
  ]
</script>

<Sidebar disableClickOutside show>
  {#each routes as route (route.path)}
    {#if route.isVisible}
      <SidebarItem
        icon={route.icon}
        isActive={isSameRoute(route.path, page.routeId ?? '')}
        link={route.path}
        on:click={() => (page.routeId = route.path)}>{route.text}</SidebarItem
      >
    {/if}
  {/each}
</Sidebar>
