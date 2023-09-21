import { bookmarkedValidatorsApi } from '../../../../server/validators/validators-api'
import type { LayoutLoad } from './$types'
import { getValidators } from '@api/utils/entities/validator'
import { bookmarkedValidatorsStore } from '../../../../stores'
import type { NetworkConfigurationResponse } from '@radixdlt/babylon-gateway-api-sdk'
import { networkConfiguration } from '@stores'

export const prerender = false

export const _dependency = 'load:validators'

export type Bookmarked = { [validator: string]: boolean }

export const load: LayoutLoad = async ({ depends }) => {
  depends(_dependency)

  const bookmarkedValidators = bookmarkedValidatorsApi
    .getAll(fetch)
    .unwrapOr([] as string[])
    .then((bookmarked) =>
      bookmarked.reduce<Bookmarked>(
        (prev, curr) => ({ ...prev, [curr]: true }),
        {}
      )
    )
    .then((bookmarked) => {
      bookmarkedValidatorsStore.set(bookmarked)
      return bookmarked
    })

  const networkConfig = await new Promise<NetworkConfigurationResponse>(
    (resolve) => {
      let unsub = networkConfiguration.subscribe((config) => {
        if (config) {
          resolve(config)
          unsub()
        }
      })
    }
  )

  const validatorsResponse = getValidators(
    networkConfig.well_known_addresses.validator_owner_badge
  )

  return {
    promises: {
      validators: validatorsResponse.then(({ validators }) => validators),
      ledger_state: validatorsResponse.then(({ ledger_state }) => ledger_state),
      bookmarkedValidators
    }
  }
}
