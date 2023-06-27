import type { LayoutServerLoad } from './$types'
import { NotarizedTransaction } from '@radixdlt/radix-engine-toolkit'
import { getTransactionDetails } from '@api/gateway'
import { redirect } from '@sveltejs/kit'

export const prerender = false

export const load: LayoutServerLoad = async ({ params, route }) => {
  if (!route.id.includes('raw-receipt') && !route.id.includes('details')) {
    throw redirect(301, `/transaction/${params.transaction}/details`)
  }

  let resolveManifest: (value?: string) => void
  let manifest = new Promise<string | undefined>(
    (resolve) => (resolveManifest = resolve)
  )

  const tx = getTransactionDetails(params.transaction).then((tx) => {
    tx.encodedManifest
      ? NotarizedTransaction.decompile(
          Buffer.from(tx.encodedManifest, 'hex')
        ).then((notarizedTx: any) =>
          resolveManifest(
            notarizedTx.signedIntent.intent.manifest.instructions
              .value as string
          )
        )
      : resolveManifest('')
    return tx
  })

  return {
    address: params.transaction,
    activeTab: route.id.split('/').pop(),
    promises: {
      tx,
      manifest
    }
  }
}
