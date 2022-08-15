import type { RequestHandler } from './__types'
import { Gateway } from 'radix-js'
import type { Validator, ValidatorsAPIResponse } from '@types'
import BigNumber from 'bignumber.js'
import { MAINNET_URL } from '@constants'
import { toWholeUnits } from '@utils'

export const GET: RequestHandler = async () => {
  const validatorsResponse: ValidatorsAPIResponse = await (
    await Gateway.validators(MAINNET_URL)
  ).json()

  const validators = validatorsResponse.validators

  const totalStake = validators.reduce(
    (accumulatedStake, validator) =>
      accumulatedStake.plus(validator.stake.value),
    BigNumber(0)
  )

  const transformedValidators: Validator[] = validators.map((validator) => ({
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
  }))



  return validatorsResponse
    ? {
        status: 200,
        body: { validators: transformedValidators }
      }
    : {
        status: 404
      }
}
