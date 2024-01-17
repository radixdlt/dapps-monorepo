import { getTransactionDetailsNew } from '@common/api/_deprecated/gateway'
import { CURRENT_NETWORK } from '@common/network'
import type { LayoutServerLoad } from './$types'
import { RadixEngineToolkit } from '@common/utils/ret'

export const load: LayoutServerLoad = ({ params }) => {
  const details = getTransactionDetailsNew(params.transaction)

  let resolveManifest: (value?: string) => void
  let manifest = new Promise<string | undefined>(
    (resolve) => (resolveManifest = resolve)
  )

  details.then((result) => {
    if (result.isErr()) return undefined

    const tx = result.value

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
  })

  return {
    promises: {
      manifest
    }
  }
}
