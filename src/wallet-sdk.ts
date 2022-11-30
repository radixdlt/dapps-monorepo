import { getNetworkConfig } from '@constants'
import WalletSdk from '@radixdlt/wallet-sdk'

export const getWalletSDK = () =>
  WalletSdk({
    networkId: getNetworkConfig()?.id,
    dAppId: 'radixdlt.dashboard.com',
    logLevel: 'DEBUG'
  })
