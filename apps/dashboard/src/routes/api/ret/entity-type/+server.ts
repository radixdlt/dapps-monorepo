import { RadixEngineToolkit } from '@common/utils/ret'
import { error, json } from '@sveltejs/kit'
import type { RequestEvent } from './$types'

export const POST = async ({ request }: RequestEvent) => {
  const { addresses }: { addresses: string[] } = await request.json()

  try {
    const entityTypes = await Promise.all(
      addresses.map((address) =>
        RadixEngineToolkit.Address.entityType(address).then((entityType) => ({
          [address]: entityType
        }))
      )
    ).then((entityTypes) => entityTypes.reduce((a, b) => ({ ...a, ...b }), {}))

    return json(entityTypes, {
      status: 200
    })
  } catch (e) {
    return error(400)
  }
}
