import { networkConfig } from '@constants'
import WalletSdk from '@radixdlt/wallet-sdk'

export const getWalletSDK = () =>
  WalletSdk({
    networkId: networkConfig?.id,
    dAppId: 'radixdlt.dashboard.com',
    logLevel: 'DEBUG'
  })
