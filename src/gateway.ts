import { MAINNET_URL } from '@constants'
import { Gateway } from 'radix-js'

export const transactionStatus = (txID: string) =>
  Gateway.transactionStatus(txID)(MAINNET_URL)

export const validators = () => Gateway.validators(MAINNET_URL)

export const stakePositions = (address: string) =>
  Gateway.getStakePositions(address)(MAINNET_URL)
