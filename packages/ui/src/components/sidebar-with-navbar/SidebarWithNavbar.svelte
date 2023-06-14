<script lang="ts">
  import SidebarItem from '@components/sidebar-item/SidebarItem.svelte'
  import Sidebar from '@components/_base/sidebar/Sidebar.svelte'
  import type { Page } from '@sveltejs/kit'
  import { isSameRoute } from '../../utils'
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'

  export let page: Page<Record<string, string>> = {} as any // TODO: fix this after storybook gets typesupport

  export let routes: {
    text: string
    icon: string
    path: string
  }[] = []
</script>

<Sidebar disableClickOutside show>
  <Box p="none" justify="between" flex="col" cx={{ height: '100%' }}>
    <Box px="none" py="medium">
      {#each routes as route (route.path)}
        <SidebarItem
          icon={route.icon}
          isActive={isSameRoute(route.path, page.route.id ?? '')}
          link={route.path}
          on:click={() => (page.route.id = route.path)}
          >{route.text}</SidebarItem
        >
      {/each}
    </Box>
    <Box border="top" p="medium">
      <Text bold size="small" align="center"
        ><a href="https://www.radixdlt.com/privacy-policy" target="_blank"
          >Privacy Notice</a
        ></Text
      >
    </Box>
  </Box>
</Sidebar>
