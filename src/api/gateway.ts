import {
  Configuration,
  StateApi,
  TransactionApi,
  type StateEntityDetailsResponseItem
} from '@radixdlt/babylon-gateway-api-sdk'
import { andThen, pipe } from 'ramda'
import { CURRENT_NETWORK } from '../../src/network'

const config = new Configuration({ basePath: CURRENT_NETWORK?.url })

const stateApi = new StateApi(config)
const transactionApi = new TransactionApi(config)

export const getTransactionDetails = pipe(
  (intent_hash_hex: string, stateVersion?: number) =>
    transactionApi.transactionCommittedDetails({
      transactionCommittedDetailsRequest: {
        intent_hash_hex,
        ...(stateVersion
          ? {
              at_ledger_state: {
                state_version: stateVersion
              }
            }
          : {})
      }
    }),
  andThen((res) => ({
    ledgerState: res.ledger_state,
    status: res.transaction.transaction_status,
    date: res.transaction.confirmed_at,
    fee: res.transaction.fee_paid?.value,
    message: res.details.message_hex,
    details: res.details.raw_hex,
    receipt: res.details.receipt,
    referencedEntities: res.details.referenced_global_entities,
    createdEntities: (res.details.receipt as any).state_updates
      .new_global_entities as { global_address: string }[],
    stateVersion: res.transaction.state_version
  }))
)

export const getEntitiesDetails = async (addresses: string[]) =>
  stateApi.stateEntityDetails({
    stateEntityDetailsRequest: { addresses }
  })

export const getEntityDetails = (address: string) =>
  stateApi
    .stateEntityDetails({
      stateEntityDetailsRequest: { addresses: [address] }
    })
    .then(({ items }) => items[0] as StateEntityDetailsResponseItem)

export const getEntityNonFungibleIDs = (
  accountAddress: string,
  nftAddress: string
) =>
  stateApi.entityNonFungibleIdsPage({
    stateEntityNonFungibleIdsPageRequest: {
      address: accountAddress,
      vault_address: accountAddress,
      resource_address: nftAddress
    }
  })

export const getNonFungibleData = (address: string, id: string) =>
  stateApi.nonFungibleDetails({
    stateNonFungibleDetailsRequest: {
      resource_address: address,
      non_fungible_ids: [id]
    }
  })

export const getNonFungibleIDs = (address: string) =>
  stateApi.nonFungibleIds({
    stateNonFungibleIdsRequest: {
      resource_address: address
    }
  })
