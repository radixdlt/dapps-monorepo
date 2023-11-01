<script lang="ts">
  import '@fonts'
  import Layout from '@components/layout/Layout.svelte'
  import { featureFlags } from '@featureFlags'
  import { darkTheme } from '@styles'
  import { navigating, page } from '$app/stores'
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
    RadixDappToolkit,
    createLogger
  } from '@common/rdt'
  import { CURRENT_NETWORK } from '@networks'
  import Theme from '@components/_base/theme/Theme.svelte'
  import { accountLabel } from '@utils'
  import { authApi } from '../server/auth/auth-api'
  import ValidatorsIcon from '@icons/validators-menu.svg'
  import { resolveRDT } from '../../../../packages/ui/src/radix'
  import LogoIcon from '@images/dashboard-logo.svg'
  import Footer from '@components/footer/Footer.svelte'
  import ErrorPage from '@dashboard-pages/error-page/ErrorPage.svelte'
  import { callApi } from '@api/gateway'
  import { errorPage } from '../stores'
  import { NETWORK_CONFIG } from '@constants'
  import { PUBLIC_NETWORK_NAME } from '$env/static/public'
  import Dialog from '@components/_base/dialog/Dialog.svelte'
  import ButtonNew from '@components/_base/button/ButtonNew.svelte'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import Cross from '@icons/cross-2.svg'
  import External from '@icons/external-white.svg'
  import ExternalBlack from '@icons/external-black.svg'
  import { beforeNavigate, goto } from '$app/navigation'

  let mounted = false

  const { createChallenge } = authApi

  $: {
    $page
    $errorPage = undefined
  }

  let displayNavigationWarning = false

  let resolveNavigation: (confirm: boolean) => void

  let externalUrl: string

  beforeNavigate(async ({ to, cancel }) => {
    if (to?.url.origin === window.location.origin || !to) return
    cancel()

    const confirmExternalNavigation = new Promise<boolean>((resolve) => {
      resolveNavigation = resolve
    })

    externalUrl = to!.url.href
    displayNavigationWarning = true

    const confirmation = await confirmExternalNavigation

    if (!confirmation) return
    goto(to!.url.href)
  })

  onMount(() => {
    callApi('getNetworkConfiguration').then((res) =>
      res.match(
        networkConfiguration.set,
        (e) =>
          ($errorPage = {
            ...e,
            message: 'Something happened while loading network.'
          })
      )
    )

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

<Theme theme="light">
  {#if CURRENT_NETWORK.id !== NETWORK_CONFIG['mainnet'].id}
    <div class="banner">
      This dApp is configured to use the testnet {PUBLIC_NETWORK_NAME}. It does
      not use the Radix Public Network mainnet.
    </div>
  {/if}
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
        <div>
          {#if $errorPage}
            <ErrorPage
              status={$errorPage.status}
              message={$errorPage.message}
              traceId={$errorPage.traceId}
            />
          {:else}
            <slot />
          {/if}
        </div>
        <Footer />
      </div>
    </Layout>
  {/if}

  <Dialog bind:open={displayNavigationWarning}>
    <div class="external-page-warning">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        on:click={() => {
          resolveNavigation(false)
          displayNavigationWarning = false
        }}
        class="close-icon"
      >
        <IconNew icon={Cross} faded />
      </div>
      <div class="external-icon">
        <IconNew icon={ExternalBlack} --size="1.5rem" />
      </div>

      <h2 class="warning-title">Leaving Radix Dashboard</h2>

      <p class="warning-text">
        You are now leaving the Radix Dashboard and redirecting to {externalUrl}
      </p>

      <div class="button">
        <ButtonNew
          size="big"
          on:click={() => {
            resolveNavigation(true)
            displayNavigationWarning = false
          }}
        >
          <div class="continue-btn">
            <IconNew icon={External} />
            Continue
          </div>
        </ButtonNew>
      </div>
    </div>
  </Dialog>
</Theme>

<style lang="scss" global>
  .page {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    min-height: calc(100vh - 211px);
    @include mixins.desktop {
      min-height: calc(100vh - 135px);
    }
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

  .banner {
    background: var(--color-alert);
    padding: var(--spacing-md);
    text-align: center;
  }

  .external-page-warning {
    display: grid;
    grid:
      'close     title'
      'icon      title'
      'content   content'
      'button    button' / 1.5rem 1fr;
    width: 20rem;
    row-gap: var(--spacing-lg);

    .close-icon {
      grid-area: close;
      cursor: pointer;
    }

    .external-icon {
      grid-area: icon;
      transform: translateX(-3px);
    }

    .warning-title {
      grid-area: title;
      align-self: end;
      margin: 0;
    }

    .warning-text {
      grid-area: content;
      margin-bottom: var(--spacing-lg);
    }

    .button {
      grid-area: button;
      .continue-btn {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        color: var(--theme-light);
      }
    }
  }
</style>
