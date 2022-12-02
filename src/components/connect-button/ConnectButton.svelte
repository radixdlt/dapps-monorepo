<script lang="ts">
  import { accounts, selectedAccount } from '@stores'
  import { configureConnectButton } from '../../wallet-sdk'

  const { destroy } = configureConnectButton({
    dAppId: 'dashboard',
    logLevel: 'DEBUG',
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
    // clean up dangling subscriptions when HMR is triggered
    onDestroy: () => destroy()
  })
</script>

<!--- Implicit import through web-components. This is the preferred way to import
components. Be sure to make all of these explicit in our code base like below -->

<radix-connect-button />
