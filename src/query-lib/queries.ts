import { RequestAddressesIO } from '@io/wallet'
import WalletSdk from '@radixdlt/alphanet-walletextension-sdk'
import { makeQueries } from 'svelte-samlat'
import { MAINNET_URL } from '@constants'
import { Gateway } from 'radix-js'
import {
  TransactionIO,
  TransactionTransformedIO,
  ValidatorArrayIO,
  ValidatorTransformedArrayIO
} from '@io/gateway'
import BigNumber from 'bignumber.js'
import { toWholeUnits } from '@utils'

export const requestAddresses = makeQueries({
  fn: async () => {
    const sdk = WalletSdk()
    const res = await sdk.request({
      accountAddresses: 'any'
    })
    if (res.isOk()) return res.value
    else throw Error(res.error.message)
  },
  decoder: (res) => RequestAddressesIO.parse(res),
  transformationFn: (res) => res
})

export const getValidators = makeQueries({
  fn: async () => Gateway.validators(MAINNET_URL),
  decoder: ValidatorArrayIO.parse,
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
  fn: async (txID: string) => Gateway.transactionStatus(txID)(MAINNET_URL),
  decoder: TransactionIO.parse,
  transformationFn: (res) => {
    const transformedResponse = {
      status: res.transaction.transaction_status.status,
      actions: res.transaction.actions.map((action) => ({
        from: action.from_account.address,
        to: action.to_account.address,
        amount: toWholeUnits(action.amount.value)
      }))
    }
    return TransactionTransformedIO.parse(transformedResponse)
  }
})
