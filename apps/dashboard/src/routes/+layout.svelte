<script lang="ts">
  import '@fonts'
  import Header from '@components/header/Header.svelte'
  import { featureFlags } from '@featureFlags'
  import { darkTheme, getCssText } from '@styles'
  import { navigating, page } from '$app/stores'
  import { onMount } from 'svelte'
  import { accounts, selectedAccount, storage } from '@stores'
  import SidebarWithNavbar from '@components/sidebar-with-navbar/SidebarWithNavbar.svelte'
  import Box from '@components/_base/box/Box.svelte'
  import { resolveRDT } from '../radix'
  import {
    RadixDappToolkit,
    DataRequestOutput
  } from '@radixdlt/radix-dapp-toolkit'
  import { CURRENT_NETWORK } from '@networks'
  import Theme from '@components/_base/theme/Theme.svelte'
  import { accountLabel } from '@utils'
  import { createLogger } from '@radixdlt/radix-dapp-toolkit'
  import { authApi } from '../server/auth/auth-api'
  import LayersIcon from '@icons/layers.svg'
  import TransactionsIcon from '@icons/transactions.svg'
  import TokensIcon from '@icons/tokens.svg'
  import NftsIcon from '@icons/nfts.svg'
  import DappMetadataIcon from '@icons/dapp-metadata.svg'
  import ValidatorsIcon from '@icons/validators-menu.svg'

  let mounted = false

  const { createChallenge, login } = authApi

  onMount(() => {
    const updateAccounts = (value: DataRequestOutput['accounts']) => {
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
        networkId: CURRENT_NETWORK?.id
      },
      async (requestData) => {
        await createChallenge()
          .andThen((challenge) =>
            requestData({
              challenge,
              accounts: { quantifier: 'atLeast', quantity: 1 }
            })
          )
          .andThen(({ signedChallenges, accounts }) =>
            login(signedChallenges[0]).map(() => {
              updateAccounts(accounts)
            })
          )
      },
      {
        explorer: {
          baseUrl: '/',
          accountsPath: 'account/',
          transactionPath: 'transaction/'
        },
        logger: createLogger(0),
        onInit: ({ walletData }) => updateAccounts(walletData.accounts),
        onStateChange: ({ walletData }) => updateAccounts(walletData.accounts),
        onDisconnect: () => updateAccounts([])
      }
    )

    resolveRDT(rdt)
  })

  const routes: {
    text: string
    icon: string
    path: string
  }[] = [
    {
      text: 'Deploy Package',
      icon: LayersIcon,
      path: '/deploy-package'
    },
    {
      text: 'Send Raw Transaction',
      icon: TransactionsIcon,
      path: '/transaction-manifest'
    },
    {
      text: 'Send Tokens',
      icon: TokensIcon,
      path: '/send-tokens'
    },
    {
      text: 'Send NFTs',
      icon: NftsIcon,
      path: '/send-nft'
    },
    {
      text: 'Manage dApp Definition',
      icon: DappMetadataIcon,
      path: '/dapp-metadata'
    },
    {
      text: 'Validators',
      icon: ValidatorsIcon,
      path: '/validators'
    }
  ]

  $: if (mounted) {
    document.body.classList[$storage.theme === 'dark' ? 'add' : 'remove'](
      darkTheme
    )
  }

  navigating
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
      gridTemplateRows: 'auto auto',
      gridTemplateAreas: `
    "header header"
    "nav content"`
    }}
  >
    {#if mounted}
      <Header />
      <SidebarWithNavbar page={$page} {routes} />
      <div class="main-content">
        <slot />
      </div>
      <center />
    {/if}
  </Box>
</Theme>

<style lang="scss" global>
  @use '../../../../packages/ui/src/global.css';

  .main-content {
    background: var(--theme-surface-1);
    grid-area: content;
    padding-bottom: var(--spacing-lg);
  }
</style>
