import { CURRENT_NETWORK } from './../../../../../../../packages/ui/src/network'
import type { LayoutServerLoad } from './$types'
import { RadixEngineToolkit } from '@radixdlt/radix-engine-toolkit'
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

  const tx = getTransactionDetails(params.transaction)
    .then((tx) => {
      tx.encodedManifest
        ? RadixEngineToolkit.NotarizedTransaction.decompile(
            Buffer.from(tx.encodedManifest, 'hex')
          )
            .then((notarizedTx) =>
              RadixEngineToolkit.Instructions.convert(
                notarizedTx.signedIntent.intent.manifest.instructions,
                CURRENT_NETWORK.id,
                'String'
              )
            )
            .then((instructions) => {
              resolveManifest(instructions.value as string)
            })
        : resolveManifest('')
      return tx
    })
    .catch(() => undefined)

  return {
    address: params.transaction,
    promises: {
      tx,
      manifest
    }
  }
}
