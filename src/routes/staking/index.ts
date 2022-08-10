import type { RequestHandler } from "./__types"
import { MAINNET_URL } from "@constants"
import { Gateway } from "radix-js"
import type {ValidatorsAPIResponse } from "@types"
import BigNumber from "bignumber.js"

export const GET: RequestHandler = async () => {
  const response: ValidatorsAPIResponse = await (await Gateway.validators(MAINNET_URL)).json()

  const validators = response.validators

  const totalStake = validators.reduce(
    (accumulatedStake, validator) => accumulatedStake.plus(validator.stake.value),
    BigNumber(0)
  )

  const transformed = validators.map(validator => ({
    ...validator,
    stake: {
        ...validator.stake,
        value: BigNumber(validator.stake.value).div(10**18).decimalPlaces(2)
    },
    info: {
        ...validator.info,
        owner_stake: {
            ...validator.info.owner_stake,
            value: BigNumber(validator.info.owner_stake.value).div(10**18).decimalPlaces(2)
        }
    },
    stakePercentage: BigNumber(validator.stake.value).div(totalStake).multipliedBy(100).decimalPlaces(2)
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
