<script lang="ts">
  import '@fonts'
  import Layout from '@components/layout/Layout.svelte'
  import { featureFlags } from '@featureFlags'
  import { darkTheme, getCssText } from '@styles'
  import { navigating } from '$app/stores'
  import { onMount } from 'svelte'
  import {
    accounts,
    networkConfiguration,
    selectedAccount,
    storage
  } from '@stores'
  import { RadixDappToolkit, Account } from '@radixdlt/radix-dapp-toolkit'
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
  import { getNetworkConfiguration } from '@api/gateway'
  import { resolveRDT } from '../../../../packages/ui/src/radix'

  let mounted = false

  const { createChallenge, login } = authApi

  onMount(() => {
    getNetworkConfiguration().then((res) => {
      networkConfiguration.set(res)
    })
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
      dAppDefinitionAddress: CURRENT_NETWORK.dappDefAddress,
      networkId: CURRENT_NETWORK?.id,
      logger: createLogger(0),
      onDisconnect: () => updateAccounts([])
    })

    rdt.state$.subscribe((state) => {
      updateAccounts(state.walletData.accounts)
    })

    rdt.walletData.provideChallengeGenerator(() =>
      createChallenge().unwrapOr('')
    )

    resolveRDT(rdt)
  })

  const routes = [
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
  {#if mounted}
    <Layout {routes}><slot /></Layout>
  {/if}
</Theme>

<style lang="scss" global>
  @use '../../../../packages/ui/src/global.scss';

  .main-content {
    background: var(--theme-surface-1);
    grid-area: content;
    padding-bottom: var(--spacing-lg);
    position: relative;
  }
</style>
