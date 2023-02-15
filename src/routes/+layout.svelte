<script lang="ts">
  import { featureFlags } from '@featureFlags'
  import Header from '@components/header/Header.svelte'
  import { darkTheme, getCssText } from '@styles'
  import { navigating, page } from '$app/stores'
  import { onMount } from 'svelte'
  import { accounts, selectedAccount, storage } from '@stores'
  import SidebarWithNavbar from '@components/sidebar-with-navbar/SidebarWithNavbar.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import Toast from '@components/_base/toast/_Toast.svelte'
  import { resolveRDT } from '../radix'
  import '../fonts.css'
  import { RadixDappToolkit } from '@radixdlt/radix-dapp-toolkit'
  import { networkConfig } from '@constants'

  let mounted = false

  onMount(() => {
    mounted = true

    const rdt = RadixDappToolkit(
      {
        dAppDefinitionAddress: networkConfig.dappDefAddress!,
        dAppName: 'Dashboard'
      },
      (requestData) => {
        requestData({
          accounts: { quantifier: 'atLeast', quantity: 1 }
        }).map(({ data }) => {
          accounts.set(data.accounts)
          selectedAccount.set(data.accounts[0])
        })
      },
      {
        explorer: {
          baseUrl: '/',
          accountsPath: 'account/',
          transactionPath: 'transaction/'
        },
        networkId: networkConfig?.id,
        onInit: (state) => {
          if (state.accounts) {
            accounts.set(state.accounts)
            selectedAccount.set(state.accounts[0])
          }
        },
        onDisconnect: () => {
          accounts.set([])
          selectedAccount.set(undefined)
        }
      }
    )

    resolveRDT(rdt)
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
<!-- eslint-disable-next-line -->
{@html `<${''}style id="stitches">${getCssText()}</${''}style>`}
<Toast />

<Box
  p="none"
  cx={{
    display: 'grid',
    gridTemplateColumns: '250px auto',
    gridTemplateRows: '100px auto',
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
        backgroundColor: '$background',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: '$6xl'
      }}
    >
      <slot />
    </Box>
    <center />
  {/if}
</Box>
