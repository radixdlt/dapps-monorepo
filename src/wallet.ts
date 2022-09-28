import WalletSdk from '@radixdlt/alphanet-walletextension-sdk'

const sdk = WalletSdk()

export const requestAddresses = () => sdk.request({ accountAddresses: 'any' })

export const sendTransaction = (
  transactionManifest: string,
  blobs?: string[]
) => sdk.sendTransaction(transactionManifest, blobs)
