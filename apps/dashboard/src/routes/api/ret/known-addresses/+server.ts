import { RadixEngineToolkit } from '@common/ret'
import { CURRENT_NETWORK } from '@networks'
import { error, json } from '@sveltejs/kit'

export const GET = async () => {
  try {
    const knownAddresses = await RadixEngineToolkit.Utils.knownAddresses(
      CURRENT_NETWORK.id
    )

    return json(knownAddresses, {
      status: 200
    })
  } catch (e) {
    return error(400)
  }
}
