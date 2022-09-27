import WalletSdk from '@radixdlt/wallet-sdk'

const sdk = WalletSdk()

export const request = () =>
  sdk.request({
    accountAddresses: 'any'
  })
