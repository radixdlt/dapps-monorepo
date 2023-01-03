import { makeQueries } from 'svelte-samlat'
import { decoders } from '@io'
import { sendTransaction as _sendTransaction } from '../wallet-sdk'

export const sendTransaction = makeQueries({
  fn: async ({
    transactionManifest,
    blobs,
    toastOptions
  }: {
    transactionManifest: string
    blobs?: string[]
    toastOptions?: Parameters<typeof _sendTransaction>[0]
  }) => {
    const res = await _sendTransaction(toastOptions)({
      transactionManifest,
      version: 0,
      blobs
    })
    if (res.isOk()) return res.value
  },
  decoder: (res) => decoders('SendTransactionIO', res),
  transformationFn: (res) => res
})
