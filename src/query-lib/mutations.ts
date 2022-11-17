import WalletSdk from '@radixdlt/alphanet-walletextension-sdk'
import { TransactionApi } from '@radixdlt/alphanet-gateway-api-v0-sdk'
import { makeQueries } from 'svelte-samlat'
import { SendTransactionIO } from '@io/wallet'
import { TransactionReceiptIO } from '@io/gateway'
import { withFormattedErrors } from './with-formatted-errors'

export const sendTransaction = makeQueries({
  fn: async ({
    transactionManifest,
    blobs
  }: {
    transactionManifest: string
    blobs?: string[]
  }) => {
    const sdk = WalletSdk()
    const res = await sdk.sendTransaction(transactionManifest, blobs)
    if (res.isOk()) return res.value
    else throw Error(res.error.message)
  },
  decoder: (res) => withFormattedErrors(SendTransactionIO, res),
  transformationFn: (res) => res
})

export const transactionReceipt = makeQueries({
  fn: async (intentHash: string) =>
    new TransactionApi().transactionReceiptPost({
      v0CommittedTransactionRequest: { intent_hash: intentHash }
    }),
  decoder: (res) => withFormattedErrors(TransactionReceiptIO, res),
  transformationFn: (res) => res
})
