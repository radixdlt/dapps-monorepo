import WalletSdk from '@radixdlt/alphanet-walletextension-sdk'
import { TransactionApi } from '@radixdlt/alphanet-gateway-api-v0-sdk'
import { makeQueries } from 'svelte-samlat'
import { decoders } from '@io'

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
  decoder: (res) => decoders('SendTransactionIO', res),
  transformationFn: (res) => res
})

export const transactionReceipt = makeQueries({
  fn: async (intentHash: string) =>
    new TransactionApi().transactionReceiptPost({
      v0CommittedTransactionRequest: { intent_hash: intentHash }
    }),
  decoder: (res) => decoders('TransactionReceiptIO', res),
  transformationFn: (res) => res
})
