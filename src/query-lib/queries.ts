import { makeQueries } from 'svelte-samlat'
import { OLYMPIA_MAINNET_URL } from '@constants'
import { Gateway } from 'radix-js'
import {
  Configuration,
  TransactionApi,
  TransactionLookupOrigin
} from '@radixdlt/babylon-gateway-api-sdk'
import {
  TransactionTransformedIO,
  ValidatorTransformedArrayIO
} from '@io/gateway'
import BigNumber from 'bignumber.js'
import { toWholeUnits } from '@utils'
import { decoders } from '@io'
import { getWalletSDK } from '../wallet-sdk'

const transactionApi = new TransactionApi(
  new Configuration({
    basePath: networkConfig.url
  })
)

export const requestAddresses = makeQueries({
  fn: async () => {
    const sdk = getWalletSDK()
    const res = await sdk.request({
      oneTimeAccountAddresses: {
        requiresProofOfOwnership: false
      }
    })
    if (res.isOk()) return res.value
    else throw Error(res.error.message)
  },
  decoder: (res) => decoders('RequestAddressesIO', res),
  transformationFn: (res) => res
})

export const getValidators = makeQueries({
  fn: async () => Gateway.validators(OLYMPIA_MAINNET_URL),
  decoder: (res) => decoders('ValidatorArrayIO', res),
  transformationFn: (res) => {
    const totalStake = res.validators.reduce(
      (accumulatedStake, validator) =>
        accumulatedStake.plus(validator.stake.value),
      BigNumber(0)
    )
    const transformedValidators = res.validators.map((validator) => ({
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
    return ValidatorTransformedArrayIO.parse(transformedValidators)
  }
})

export const getTransactionStatus = makeQueries({
  fn: async (txID: string) =>
    transactionApi.transactionStatus({
      transactionStatusRequest: {
        transaction_identifier: {
          origin: TransactionLookupOrigin.Payload,
          value_hex: txID
        }
      }
    }),
  decoder: (res) => decoders('TransactionIO', res),
  transformationFn: (res) => {
    const transformedResponse = {
      status: res.transaction.transaction_status.status
    }
    return TransactionTransformedIO.parse(transformedResponse)
  }
})
