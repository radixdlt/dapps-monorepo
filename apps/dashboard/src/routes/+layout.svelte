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
  import {
    Account,
    DataRequestBuilder,
    RadixDappToolkit
  } from '@radixdlt/radix-dapp-toolkit'
  import { CURRENT_NETWORK } from '@networks'
  import Theme from '@components/_base/theme/Theme.svelte'
  import { accountLabel } from '@utils'
  import { createLogger } from '@radixdlt/radix-dapp-toolkit'
  import { authApi } from '../server/auth/auth-api'
  import ValidatorsIcon from '@icons/validators-menu.svg'
  import { getNetworkConfiguration } from '@api/gateway'
  import { resolveRDT } from '../../../../packages/ui/src/radix'
  import LogoIcon from '@images/dashboard-logo.svg'
  import Footer from '@components/footer/Footer.svelte'

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
      dAppDefinitionAddress: CURRENT_NETWORK.dashboardDappAddress,
      networkId: CURRENT_NETWORK?.id,
      logger: createLogger(0),
      onDisconnect: () => updateAccounts([])
    })

    rdt.walletApi.setRequestData(
      DataRequestBuilder.accounts().atLeast(1),
      DataRequestBuilder.persona().withProof()
    )

    rdt.walletApi.provideChallengeGenerator(() =>
      createChallenge().unwrapOr('')
    )

    rdt.walletApi.dataRequestControl(async ({ proofs }) => {
      const personaProof = proofs.find((proof) => proof.type === 'persona')
      if (personaProof) {
        const result = await authApi.login(personaProof)
        if (result.isErr()) throw new Error("Couldn't login")
      }
    })

    rdt.walletApi.walletData$.subscribe(({ accounts }) => {
      updateAccounts(accounts)
    })

    resolveRDT(rdt)
  })

  const routes = [
    {
      text: 'Network Staking',
      icon: ValidatorsIcon,
      path: '/network-staking'
    }
  ]

  $: if (mounted) {
    document.body.classList[$storage.theme === 'dark' ? 'add' : 'remove'](
      darkTheme
    )
  }

  navigating

  let hideSearch = false
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
</svelte:head>

<!-- enables SSR of css -->
<!-- eslint-disable-next-line -->
{@html `<${''}style id="stitches">${getCssText()}</${''}style>`}

<Theme theme="light">
  {#if mounted}
    <Layout {hideSearch} {routes}>
      <!-- svelte-ignore a11y-missing-content -->
      <a
        slot="logo"
        href="/"
        class="logo"
        style:background-image="url({LogoIcon})"
        style:margin-bottom="var(--spacing-lg)"
      />
      <div class="page">
        <slot />
        <Footer />
      </div>
    </Layout>
  {/if}
</Theme>

<style lang="scss" global>
  @use '../../../../packages/ui/src/global.scss';

  .page {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  .logo {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    width: 10.125rem;
    height: 1.5rem;
    display: inline-flex;
    margin-left: var(--spacing-lg);
  }
</style>
