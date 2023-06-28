import { bookmarkedValidatorsApi } from './../../../server/validators/validators-api'
import type { LayoutLoad } from './$types'
import { getValidatorsList } from '@api/gateway'
import { getEnumStringMetadata } from '@api/utils/resources'
import type { Validator } from '@pages/navbar-pages/staking/Validators.svelte'

export const load: LayoutLoad = ({ fetch }) => {
  const validators = getValidatorsList().then((validators) =>
    validators.map((validator) => {
      const state: any = validator.state || {}
      return {
        name: getEnumStringMetadata('name')(validator.metadata),
        website: getEnumStringMetadata('url')(validator.metadata),
        address: validator.address,
        fee: (state.validator_fee_factor || 0) * 100,
        percentageTotalStake: validator.active_in_epoch?.stake_percentage || 0,
        totalStake: parseInt(validator.current_stake),

        // TODO:
        ownerAddress: '',
        ownerStake: 0,
        percentageOwnerStake: 0,
        apy: 0,
        uptime: 0,
        acceptsStake: true,
        accumulatedStaked: 0,
        accumulatedUnstaking: 0,
        accumulatedReadyToClaim: 0
      } as Validator
    })
  )

  const bookmarkedValidators = bookmarkedValidatorsApi
    .getAll(fetch)
    .unwrapOr([]) as Promise<string[]>

  return {
    promises: {
      validators,
      bookmarkedValidators
    }
  }
}
