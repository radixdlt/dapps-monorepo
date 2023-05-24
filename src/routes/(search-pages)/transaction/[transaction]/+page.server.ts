import type { PageServerLoad } from './$types'
import { NotarizedTransaction } from '@radixdlt/radix-engine-toolkit'
import { getTransactionDetails } from '@api/gateway'

export const prerender = false

export const load: PageServerLoad = async ({ params }) => {
  let resolveManifest: (value?: string) => void
  let manifest = new Promise<string | undefined>(
    (resolve) => (resolveManifest = resolve)
  )

  const tx = getTransactionDetails(params.transaction)
    .then((res) => getTransactionDetails(params.transaction, res.stateVersion!))
    .then((tx) => {
      NotarizedTransaction.decompile(
        Buffer.from(tx.encodedManifest, 'hex')
      ).then((notarizedTx: any) =>
        resolveManifest(
          notarizedTx.signedIntent.intent.manifest.instructions.value as string
        )
      )
      return tx
    })

  return {
    address: params.transaction,
    promises: {
      tx,
      manifest
    }
  }
}