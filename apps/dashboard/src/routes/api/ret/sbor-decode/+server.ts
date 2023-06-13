import { RadixEngineToolkit, SborValue } from '@radixdlt/radix-engine-toolkit'
import { error, json } from '@sveltejs/kit'
import { CURRENT_NETWORK } from '../../../../network'
import type { RequestEvent } from './$types'

export const POST = async ({ request }: RequestEvent) => {
  const { hexEncodedSchema } = await request.json()

  try {
    const sborDecodedSchema = (await RadixEngineToolkit.sborDecode(
      hexEncodedSchema,
      CURRENT_NETWORK.id
    )) as SborValue.ManifestSbor

    return json(
      {
        decodedString: sborDecodedSchema.manifestString
      },
      {
        status: 200
      }
    )
  } catch (e) {
    return error(400)
  }
}
