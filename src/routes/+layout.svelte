<script lang="ts">
  import Header from '@components/header/Header.svelte'
  import { darkTheme, getCssText } from '@styles'
  import { navigating, page } from '$app/stores'
  import { onMount } from 'svelte'
  import { storage } from '@stores'
  import SidebarWithNavbar from '@components/sidebar-with-navbar/SidebarWithNavbar.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Toast from '@components/_base/toast/_Toast.svelte'
  import type { PageData } from './$types'
  import '../fonts.css'
  import { setNetworkConfig } from '@constants'

  let mounted = false

  export let data: PageData

  onMount(() => {
    mounted = true
    setNetworkConfig(data.network)
  })

  $: if (mounted) {
    document.body.classList[$storage.theme === 'dark' ? 'add' : 'remove'](
      darkTheme
    )
  }
  navigating
</script>

<!-- enables SSR of css -->
{@html `<${''}style id="stitches">${getCssText()}</${''}style>`}
<Toast />

<Box
  p="none"
  cx={{
    display: 'grid',
    height: '100vh',
    overflowY: 'hidden',
    gridTemplateColumns: '250px auto',
    gridTemplateRows: '70px auto',
    gridTemplateAreas: `
      "header header"
      "nav content"`
  }}
>
  {#if mounted}
    <Header />
    <SidebarWithNavbar page={$page} />
    <Box
      p="none"
      cx={{
        gridArea: 'content',
        height: '100vh',
        overflowY: 'scroll',
        backgroundColor: '$background'
      }}
    >
      <slot />
    </Box>
    <center />
  {/if}
</Box>
