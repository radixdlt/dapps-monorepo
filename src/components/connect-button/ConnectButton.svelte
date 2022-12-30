<script lang="ts">
  import { networkConfig } from '@constants'
  import { accounts, selectedAccount } from '@stores'
  import { onMount } from 'svelte'
  import { configureConnectButton } from '../../wallet-sdk'

  onMount(() => {
    const { destroy } = configureConnectButton({
      dAppId: 'dashboard',
      logLevel: 'DEBUG',
      networkId: networkConfig?.id,
      initialState: {
        loading: false,
        connected: false
      },
      onConnect: async ({ setState, getWalletData }) => {
        setState({ loading: true, connected: false })

        const response = await getWalletData({
          oneTimeAccountsWithoutProofOfOwnership: {}
        })

        if (response.isOk()) {
          accounts.set(response.value.oneTimeAccounts)
          selectedAccount.set(response.value.oneTimeAccounts[0])
          setState({ loading: false, connected: true })
        } else {
          setState({ loading: false, connected: false })
        }
      },
      onDisconnect: ({ setState }) => {
        setState({ loading: false, connected: false })
        accounts.set(undefined)
        selectedAccount.set(undefined)
      },
      // clean up dangling subscriptions when HMR is triggered
      onDestroy: () => destroy()
    })
  })
</script>

<!--- Implicit import through web-components. This is the preferred way to import
components. Be sure to make all of these explicit in our code base like below -->

<radix-connect-button />
