<script context="module">
  amplitude.init(PUBLIC_AMPLITUDE_API_KEY, {
    serverZone: 'EU',
    defaultTracking: true
  })

  export const track = amplitude.track
</script>

<script lang="ts">
  import '@fonts'
  import Layout from '@components/layout/Layout.svelte'
  import { featureFlags } from '@featureFlags'
  import { navigating, page } from '$app/stores'
  import { onMount } from 'svelte'
  import {
    accounts,
    externalNavigationConfirmation,
    selectedAccount
  } from '@stores'
  import {
    Account,
    DataRequestBuilder,
    RadixDappToolkit,
    Logger
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
  import { errorPage } from '../stores'
  import {
    PUBLIC_NETWORK_NAME,
    PUBLIC_AMPLITUDE_API_KEY
  } from '$env/static/public'
  import { NETWORK_CONFIG, NON_EXTERNAL_ORIGINS } from '@constants'
  import Dialog from '@components/_base/dialog/Dialog.svelte'
  import ButtonNew from '@components/_base/button/ButtonNew.svelte'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import Cross from '@icons/cross-2.svg'
  import External from '@icons/external-white.svg'
  import ExternalBlack from '@icons/external-black.svg'
  // @ts-ignore
  import * as amplitude from '@amplitude/analytics-browser'
  let mounted = false

  const { createChallenge } = authApi

  $: {
    $page
    $errorPage = undefined
  }

  let displayNavigationWarning = false

  $: if ($externalNavigationConfirmation) displayNavigationWarning = true

  $: if ($externalNavigationConfirmation) {
    if (
      NON_EXTERNAL_ORIGINS.includes(
        new URL($externalNavigationConfirmation.url).origin
      )
    ) {
      displayNavigationWarning = false
      $externalNavigationConfirmation.confirm(true)
    }
  }

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
      dAppDefinitionAddress: CURRENT_NETWORK.dashboardDappAddress,
      networkId: CURRENT_NETWORK?.id,
      logger: Logger(1),
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

  navigating

  let hideSearch = false
</script>

<svelte:head>
  {#if featureFlags().getFlag('cookie-banner')?.enabled}
    <script
      src="https://cdn-ukwest.onetrust.com/scripttemplates/otSDKStub.js"
      type="text/javascript"
      charset="UTF-8"
      data-domain-script="c80d24fe-47d3-44f6-8955-4870e125aa09"
    ></script>
    <script type="text/javascript">
      function OptanonWrapper() {}
    </script>
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
<Theme theme="light">
  {@const isTestnet = CURRENT_NETWORK.id !== NETWORK_CONFIG['mainnet'].id}
  {#if isTestnet}
    <div class="banner">
      This dApp is configured to use the testnet {PUBLIC_NETWORK_NAME}. It does
      not use the Radix Public Network mainnet.
    </div>
  {/if}
  {#if mounted}
    <Layout {hideSearch} {routes} {isTestnet}>
      <!-- svelte-ignore a11y-missing-content -->

      <a
        slot="logo"
        href="/"
        class="logo"
        style:background-image="url({LogoIcon})"
      />

      <div class="page">
        <div>
          {#if $errorPage}
            <ErrorPage
              status={$errorPage.code}
              message={$errorPage.message}
              traceId={$errorPage.trace_id}
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
          const navigation = $externalNavigationConfirmation
          if (navigation) navigation.confirm(false)
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
        You are now leaving the Radix Dashboard and redirecting to {$externalNavigationConfirmation?.url}
      </p>

      <div class="button">
        <ButtonNew
          size="big"
          on:click={() => {
            const navigation = $externalNavigationConfirmation
            if (navigation) navigation.confirm(true)
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
  body {
    overflow: hidden;
  }
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
    height: 2rem;
    display: inline-flex;
    margin-left: var(--spacing-lg);
  }

  .banner {
    background: var(--color-alert-1);
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
