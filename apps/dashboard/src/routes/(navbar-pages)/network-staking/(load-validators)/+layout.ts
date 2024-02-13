import { bookmarkedValidatorsApi } from '../../../../server/validators/validators-api'
import type { LayoutLoad } from './$types'
import { bookmarkedValidatorsStore } from '../../../../stores'
import type { NetworkConfigurationResponse } from '@common/gateway-sdk'
import { networkConfiguration } from '@stores'
import { ResultAsync } from 'neverthrow'
import { handleGatewayResult } from '../../../../utils'
import { pipe } from 'ramda'
import { getValidators } from '@api/utils/entities/component/validator'

export type Bookmarked = { [validator: string]: boolean }

const ERROR_MSG = 'Failed to load validators.'

const handleGatewayWithErrorMessage = handleGatewayResult((_) => ERROR_MSG)

export const load: LayoutLoad = () => {
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

  const networkConfig = new Promise<NetworkConfigurationResponse>((resolve) => {
    let unsub = networkConfiguration.subscribe((config) => {
      if (config) {
        resolve(config)
        if (unsub) {
          unsub()
        }
      }
    })
  })

  const validatorsResponse = pipe(
    () =>
      ResultAsync.fromSafePromise(networkConfig).andThen((config) =>
        getValidators(
          config.well_known_addresses.validator_owner_badge,
          true,
          true
        )
      ),
    handleGatewayWithErrorMessage
  )()

  return {
    promises: {
      validators: validatorsResponse.then(({ validators }) => validators),
      ledger_state: validatorsResponse.then(({ ledger_state }) => ledger_state),
      bookmarkedValidators
    }
  }
}
