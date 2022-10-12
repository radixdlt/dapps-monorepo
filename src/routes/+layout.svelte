<script lang="ts">
  import Header from '@components/header/Header.svelte'
  import { darkTheme, getCssText } from '@styles'
  import { page } from '$app/stores'
  import '../fonts.css'
  import { onMount } from 'svelte'
  import { storage } from '@stores'
  import SidebarWithNavbar from '@components/sidebar-with-navbar/SidebarWithNavbar.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import { goto } from '$app/navigation'

  let mounted = false

  onMount(() => {
    mounted = true
  })

  $: if (mounted) {
    document.body.classList[$storage.theme === 'dark' ? 'add' : 'remove'](
      darkTheme
    )
    goto('/staking')
  }
</script>

<!-- enables SSR of css -->
{@html `<${''}style id="stitches">${getCssText()}</${''}style>`}

<Box
  p="none"
  cx={{
    display: 'grid',
    height: '100vw',
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
    <Box p="none" cx={{ gridArea: 'content', backgroundColor: '$background' }}>
      <slot />
    </Box>
    <center />
  {/if}
</Box>
