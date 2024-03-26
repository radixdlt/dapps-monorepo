import type { StreamTransactionsResponse } from '@common/gateway-sdk'
import { getMostRelevantManifestClass } from './get-most-relevant-manifest-class'

export type Change = FungibleChange | NonFungibleChange

export type FungibleChange = {
  type: 'fungible'
  amount: string
  address: string
}

export type NonFungibleChange = {
  type: 'nonFungible'
  address: string
  localId: string
}

export type StreamTransactionExtension = {
  manifestClass: string
  withdrawals: Change[]
  deposits: Change[]
}

export const createManifestClassProperty = (
  streamTxResponsePromise: Promise<StreamTransactionsResponse>
) =>
  streamTxResponsePromise.then((streamTxResponse) => ({
    ...streamTxResponse,
    items: streamTxResponse.items.map((item) => ({
      ...item,
      manifestClass: getMostRelevantManifestClass(item.manifest_classes)
    }))
  }))

export const createBalanceChanges = (
  entityAddress: string,
  streamTxResponsePromise: Promise<StreamTransactionsResponse>
) =>
  streamTxResponsePromise.then((streamTxResponse) => ({
    ...streamTxResponse,
    items: streamTxResponse.items.map((transactionInfo) => {
      const withdrawals: Change[] = []
      const deposits: Change[] = []

      for (const fungibleBalanceChange of transactionInfo.balance_changes
        ?.fungible_balance_changes || []) {
        if (fungibleBalanceChange.entity_address !== entityAddress) {
          continue
        }
        if (fungibleBalanceChange.balance_change.startsWith('-')) {
          withdrawals.push({
            type: 'fungible',
            amount: fungibleBalanceChange.balance_change.substring(1),
            address: fungibleBalanceChange.resource_address
          })
        } else {
          deposits.push({
            type: 'fungible',
            amount: fungibleBalanceChange.balance_change,
            address: fungibleBalanceChange.resource_address
          })
        }
      }

      for (const nonFungibleBalanceChange of transactionInfo.balance_changes
        ?.non_fungible_balance_changes || []) {
        if (nonFungibleBalanceChange.entity_address !== entityAddress) {
          continue
        }
        for (const added of nonFungibleBalanceChange.added) {
          deposits.push({
            type: 'nonFungible',
            address: nonFungibleBalanceChange.resource_address,
            localId: added
          })
        }
        for (const removed of nonFungibleBalanceChange.removed) {
          withdrawals.push({
            type: 'nonFungible',
            address: nonFungibleBalanceChange.resource_address,
            localId: removed
          })
        }
      }

      return {
        ...transactionInfo,
        withdrawals,
        deposits
      }
    })
  }))
