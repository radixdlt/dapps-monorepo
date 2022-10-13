import type { PageServerLoad } from './$types'
import type { ValidatorTransformed } from '@types'
import BigNumber from 'bignumber.js'
import { toWholeUnits } from '@utils'
import { validators } from '@gateway'
import { ValidatorArrayIO, ValidatorTransformedArrayIO } from '../../io/gateway'

export const prerender = true

export const load: PageServerLoad = async () => {
  const response = await validators()
  const parsed = ValidatorArrayIO.parse(response)

  const totalStake = parsed.validators.reduce(
    (accumulatedStake, validator) =>
      accumulatedStake.plus(validator.stake.value),
    BigNumber(0)
  )

  const transformedValidators: ValidatorTransformed[] = parsed.validators.map(
    (validator) => ({
      address: validator.validator_identifier.address,
      name: validator.properties.name,
      totalStake: toWholeUnits(validator.stake.value),
      ownerStake: toWholeUnits(validator.info.owner_stake.value),
      uptimePercentage: validator.info.uptime.uptime_percentage,
      feePercentage: validator.properties.validator_fee_percentage,
      stakeAccepted: validator.properties.external_stake_accepted,
      stakePercentage: BigNumber(validator.stake.value)
        .div(totalStake)
        .multipliedBy(100)
        .decimalPlaces(2)
        .toNumber(),
      ownerStakePercentage: BigNumber(validator.info.owner_stake.value)
        .div(validator.stake.value)
        .multipliedBy(100)
        .decimalPlaces(2)
        .toNumber()
    })
  )

  return {
    validators: ValidatorTransformedArrayIO.parse(transformedValidators)
  }
}
