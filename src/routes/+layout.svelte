<script lang="ts">
  import { featureFlags } from '@featureFlags'
  import Header from '@components/header/Header.svelte'
  import { darkTheme, getCssText } from '@styles'
  import { navigating, page } from '$app/stores'
  import { onMount } from 'svelte'
  import { storage } from '@stores'
  import SidebarWithNavbar from '@components/sidebar-with-navbar/SidebarWithNavbar.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Text from '@components/_base/text/Text.svelte'
  import Toast from '@components/_base/toast/_Toast.svelte'
  import '../fonts.css'

  let mounted = false

  onMount(() => {
    mounted = true
  })

  $: if (mounted) {
    document.body.classList[$storage.theme === 'dark' ? 'add' : 'remove'](
      darkTheme
    )
  }
  navigating
</script>

<svelte:head>
  {#if featureFlags().getFlag('cookie-banner')?.enabled}
    <!-- OneTrust Cookies Consent Notice start for betanet-dashboard.radixdlt.com -->
    <script
      src="https://cdn-ukwest.onetrust.com/scripttemplates/otSDKStub.js"
      type="text/javascript"
      charset="UTF-8"
      data-domain-script="de2483c5-9867-4af6-9434-dfc97b731f0c"
    ></script>
    <script type="text/javascript">
      function OptanonWrapper() {}
    </script>
    <!-- OneTrust Cookies Consent Notice end for betanet-dashboard.radixdlt.com -->
  {/if}
</svelte:head>

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
    gridTemplateRows: 'auto',
    gridTemplateAreas: `
      "header header"
      "nav content"`
  }}
>
  {#if mounted}
    <Header />
    <SidebarWithNavbar page={$page} />
    <Box
      cx={{
        gridArea: 'content',
        height: '100vh',
        overflowY: 'scroll',
        backgroundColor: '$background',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: '$6xl'
      }}
    >
      <slot />
      <Box border="top" mt="auto" p="large">
        <Text bold
          ><a href="https://www.radixdlt.com/privacy-policy" target="_blank"
            >Privacy Notice</a
          ></Text
        >
      </Box>
    </Box>
    <center />
  {/if}
</Box>
