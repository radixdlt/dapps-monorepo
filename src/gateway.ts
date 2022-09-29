import { MAINNET_URL } from '@constants'
import { Gateway } from 'radix-js'
import { TransactionApi } from '@radixdlt/alphanet-gateway-api-v0-sdk'

export const transactionStatus = (txID: string) =>
  Gateway.transactionStatus(txID)(MAINNET_URL)

export const validators = () => Gateway.validators(MAINNET_URL)

export const stakePositions = (address: string) =>
  Gateway.getStakePositions(address)(MAINNET_URL)

/* Temporary for alphanet testing */
export const transactionReceipt = (intentHash: string) =>
  new TransactionApi().transactionReceiptPost({
    v0CommittedTransactionRequest: { intent_hash: intentHash }
  })
