import {
  ManifestSborStringRepresentation,
  RadixEngineToolkit
} from '@common/utils/ret'
import { error, json } from '@sveltejs/kit'
import { CURRENT_NETWORK } from '../../../../network'
import type { RequestEvent } from './$types'

export const POST = async ({ request }: RequestEvent) => {
  const { hexEncodedSchema } = await request.json()

  try {
    const decodedString = await RadixEngineToolkit.ManifestSbor.decodeToString(
      Buffer.from(hexEncodedSchema, 'hex'),
      CURRENT_NETWORK.id,
      ManifestSborStringRepresentation.ManifestString
    )

    return json(
      {
        decodedString
      },
      {
        status: 200
      }
    )
  } catch (e) {
    return error(400)
  }
}
