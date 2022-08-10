import type { RequestHandler } from "./__types"
import { MAINNET_URL } from "@constants"
import { Gateway } from "radix-js"
import type {Validator, ValidatorsAPIResponse } from "@types"
import BigNumber from "bignumber.js"

export const GET: RequestHandler = async () => {
  const response: ValidatorsAPIResponse = await (await Gateway.validators(MAINNET_URL)).json()

  const validators = response.validators

  const totalStake = validators.reduce(
    (accumulatedStake, validator) => accumulatedStake.plus(validator.stake.value),
    BigNumber(0)
  )

  const transformed: Validator[] = validators.map(validator => ({
    address: validator.validator_identifier.address,
    name: validator.properties.name,
    totalStake: BigNumber(validator.stake.value).div(10**18).decimalPlaces(2).toNumber(),
    ownerStake: BigNumber(validator.info.owner_stake.value).div(10**18).decimalPlaces(2).toNumber(),
    uptimePercentage: validator.info.uptime.uptime_percentage,
    feePercentage: validator.properties.validator_fee_percentage,
    stakeAccepted: validator.properties.external_stake_accepted,
    stakePercentage: BigNumber(validator.stake.value).div(totalStake).multipliedBy(100).decimalPlaces(2).toNumber(),
    ownerStakePercentage: BigNumber(validator.info.owner_stake.value).div(validator.stake.value).multipliedBy(100).decimalPlaces(2).toNumber()
  }))

  return response
    ? {
        status: 200,
        body: { validators: transformed }
      }
    : {
        status: 404
      }
}
