import { RadixEngineToolkit } from '@common/utils/ret'
import { error, json } from '@sveltejs/kit'
import { CURRENT_NETWORK } from '../../../../network'
import type { RequestEvent } from './$types'

export const POST = async ({ request }: RequestEvent) => {
  const { olympiaAddress } = await request.json()

  try {
    const babylonAddress = olympiaAddress.toLowerCase().includes('_rr1')
      ? await RadixEngineToolkit.Derive.resourceAddressFromOlympiaResourceAddress(
          olympiaAddress,
          CURRENT_NETWORK.id
        )
      : await RadixEngineToolkit.Derive.virtualAccountAddressFromOlympiaAccountAddress(
          olympiaAddress,
          CURRENT_NETWORK.id
        )

    return json({ babylonAddress }, { status: 200 })
  } catch (e) {
    return error(400)
  }
}
