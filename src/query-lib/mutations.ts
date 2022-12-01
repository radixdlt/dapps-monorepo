import { makeQueries } from 'svelte-samlat'
import { decoders } from '@io'
import { getMethods } from '@radixdlt/connect-button'

export const sendTransaction = makeQueries({
  fn: async ({
    transactionManifest,
    blobs
  }: {
    transactionManifest: string
    blobs?: string[]
  }) => {
    const res = await getMethods().sendTransaction({
      transactionManifest,
      version: 0,
      blobs
    })
    if (res.isOk()) return res.value
    else throw Error(res.error.message)
  },
  decoder: (res) => decoders('SendTransactionIO', res),
  transformationFn: (res) => res
})
