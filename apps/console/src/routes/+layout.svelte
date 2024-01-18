<script context="module">
  amplitude.init(PUBLIC_AMPLITUDE_API_KEY, {
    serverZone: 'EU',
    defaultTracking: true
  })

  export const track = amplitude.track
</script>

<script lang="ts">
  import '@fonts'
  import { featureFlags } from '@featureFlags'
  import { darkTheme, getCssText } from '@styles'
  import { navigating } from '$app/stores'
  import { onMount } from 'svelte'
  import { accounts, dAppToolkit, selectedAccount, storage } from '@stores'
  import {
    RadixDappToolkit,
    Account,
    DataRequestBuilder,
    createLogger
  } from '@common/rdt'
  import { CURRENT_NETWORK } from '@networks'
  import Theme from '@components/_base/theme/Theme.svelte'
  import { accountLabel } from '@utils'
  import Layout from '@components/layout/Layout.svelte'
  import LayersIcon from '@icons/layers.svg'
  import NftsIcon from '@icons/nfts.svg'
  import TokensIcon from '@icons/tokens.svg'
  import TransactionsIcon from '@icons/transactions.svg'
  import DappMetadataIcon from '@icons/dapp-metadata.svg'
  import CreateTokenIcon from '@icons/create-token.svg'
  import ConfigureMetadataIcon from '@icons/configure-metadata.svg'
  import NetworkTagIcon from '@icons/network-tag.svg'
  import { resolveRDT } from '../../../../packages/ui/src/radix'
  import LogoIcon from '@images/console-logo.svg'
  import {
    PUBLIC_AMPLITUDE_API_KEY,
    PUBLIC_NETWORK_NAME
  } from '$env/static/public'
  import { NETWORK_CONFIG } from '@constants'
  import * as amplitude from '@amplitude/analytics-browser'

  let mounted = false

  const hideSearch = true
  const showDesktopSidebar = true

  onMount(() => {
    const updateAccounts = (value?: Account[]) => {
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
    const rdt = RadixDappToolkit({
      dAppDefinitionAddress: CURRENT_NETWORK.consoleDappAddress,
      networkId: CURRENT_NETWORK.id,
      gatewayBaseUrl: CURRENT_NETWORK.url,
      logger: createLogger(0),
      onDisconnect: () => updateAccounts([])
    })

    dAppToolkit.set(rdt)

    rdt.walletApi.setRequestData(DataRequestBuilder.accounts().atLeast(1))

    rdt.walletApi.walletData$.subscribe((state) => {
      updateAccounts(state.accounts)
    })

    resolveRDT(rdt)
  })

  $: if (mounted) {
    document.body.classList[$storage.theme === 'dark' ? 'add' : 'remove'](
      darkTheme
    )
  }

  navigating

  const routes: { text: string; icon: string; path: string }[] = [
    {
      text: 'Deploy Package',
      icon: LayersIcon,
      path: '/deploy-package'
    },
    {
      text: 'Create Token',
      icon: CreateTokenIcon,
      path: '/create-token'
    },
    {
      text: 'Configure Metadata',
      icon: ConfigureMetadataIcon,
      path: '/configure-metadata'
    },
    ...(featureFlags().getFlag('send-nft')?.enabled
      ? [
          {
            text: 'Send NFTs',
            icon: NftsIcon,
            path: '/send-nft'
          }
        ]
      : []),
    ...(featureFlags().getFlag('send-token')?.enabled
      ? [
          {
            text: 'Send Token',
            icon: TokensIcon,
            path: '/send-tokens'
          }
        ]
      : []),
    {
      text: 'Send Raw Transaction',
      icon: TransactionsIcon,
      path: '/transaction-manifest'
    },
    {
      text: 'Manage dApp Definition',
      icon: DappMetadataIcon,
      path: '/dapp-metadata'
    },
    {
      text: 'Convert Olympia Address',
      icon: NetworkTagIcon,
      path: '/convert-olympia-address'
    }
  ]
</script>

<svelte:head>
  <!-- OneTrust Cookies Consent Notice start for betanet-dashboard.radixdlt.com -->
  {#if featureFlags().getFlag('cookie-banner')?.enabled}
    <script
      src="https://cdn-ukwest.onetrust.com/scripttemplates/otSDKStub.js"
      type="text/javascript"
      charset="UTF-8"
      data-domain-script="de2483c5-9867-4af6-9434-dfc97b731f0c"
    ></script>
    <!-- OneTrust Cookies Consent Notice end for betanet-dashboard.radixdlt.com -->
  {/if}

  {#if featureFlags().getFlag('google-tag-manager')?.enabled}
    <script>
      ;(function (w, d, s, l, i) {
        w[l] = w[l] || []
        w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
        var f = d.getElementsByTagName(s)[0],
          j = d.createElement(s),
          dl = l != 'dataLayer' ? '&l=' + l : ''
        j.async = true
        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl
        f.parentNode.insertBefore(j, f)
      })(window, document, 'script', 'dataLayer', 'GTM-PKNDV4C')
    </script>
  {/if}
</svelte:head>
{#if featureFlags().getFlag('google-tag-manager')?.enabled}
  <!-- Google Tag Manager (noscript) -->
  <noscript
    ><iframe
      src="https://www.googletagmanager.com/ns.html?id=GTM-PKNDV4C"
      height="0"
      width="0"
      style="display: none; visibility: hidden"
    /></noscript
  >
  <!-- End Google Tag Manager (noscript) -->
{/if}
<!-- enables SSR of css -->
<!-- eslint-disable-next-line -->
{@html `<${''}style id="stitches">${getCssText()}</${''}style>`}

<Theme theme="light">
  {#if CURRENT_NETWORK.id !== NETWORK_CONFIG['mainnet'].id}
    <div class="banner">
      This dApp is configured to use the testnet {PUBLIC_NETWORK_NAME}. It does
      not use the Radix Public Network mainnet.
    </div>
  {/if}
  {#if mounted}
    <Layout {routes} {hideSearch} {showDesktopSidebar}>
      <!-- svelte-ignore a11y-missing-content -->
      <a
        slot="logo"
        href="/"
        class="logo"
        style={`background-image: url(${LogoIcon})`}
      />
      <slot />
    </Layout>
  {/if}
</Theme>

<style lang="scss" global>
  body {
    overflow: hidden;
  }
  .logo {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    width: 12rem;
    height: 2rem;
    display: inline-flex;
    margin-left: var(--spacing-lg);
  }
  .banner {
    background: var(--color-alert-1);
    padding: var(--spacing-md);
    text-align: center;
  }
</style>
