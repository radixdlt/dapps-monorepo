import { makeQueries } from 'svelte-samlat'
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
    throw res.error
  },
  decoder: (res) => res,
  transformationFn: (res) => res
})
