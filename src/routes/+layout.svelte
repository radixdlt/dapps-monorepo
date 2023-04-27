<script lang="ts">
  import { featureFlags } from '@featureFlags'
  import Header from '@components/header/Header.svelte'
  import { darkTheme, getCssText } from '@styles'
  import { navigating, page } from '$app/stores'
  import { onMount } from 'svelte'
  import { accounts, selectedAccount, storage } from '@stores'
  import SidebarWithNavbar from '@components/sidebar-with-navbar/SidebarWithNavbar.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import { resolveRDT } from '../radix'
  import '../fonts.css'
  import { RadixDappToolkit, type State } from '@radixdlt/radix-dapp-toolkit'
  import { CURRENT_NETWORK } from '../../src/network'
  import Theme from '@components/_base/theme/Theme.svelte'
  import { accountLabel } from '@utils'
  import { createLogger } from '@radixdlt/radix-dapp-toolkit'
  let mounted = false

  onMount(() => {
    const updateAccounts = (value: State['accounts']) => {
      if (value) {
        let _accounts = value.map((account) => ({
          ...account,
          displayed: accountLabel(account)
        }))

        accounts.set(_accounts)
        selectedAccount.set(_accounts[0])
      }
    }
    mounted = true

    const rdt = RadixDappToolkit(
      {
        dAppDefinitionAddress: CURRENT_NETWORK.dappDefAddress,
        dAppName: 'Dashboard'
      },
      (requestData) => {
        requestData({
          accounts: { quantifier: 'atLeast', quantity: 1 }
        }).map(({ data }) => {
          updateAccounts(data.accounts)
        })
      },
      {
        explorer: {
          baseUrl: '/',
          accountsPath: 'account/',
          transactionPath: 'transaction/'
        },
        networkId: CURRENT_NETWORK?.id,
        logger: createLogger(0),
        onInit: ({ accounts }) => updateAccounts(accounts),
        onStateChange: ({ accounts }) => updateAccounts(accounts),
        onDisconnect: () => updateAccounts([])
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

<Theme theme="light">
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
</Theme>
