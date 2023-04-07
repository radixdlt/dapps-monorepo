import {
  Configuration,
  StateApi,
  TransactionApi,
  type FungibleResourcesCollection,
  type FungibleResourcesCollectionItemVaultAggregated,
  type NonFungibleResourcesCollection,
  type NonFungibleResourcesCollectionItemVaultAggregated,
  type StateEntityDetailsResponseItem
} from '@radixdlt/babylon-gateway-api-sdk'
import { andThen, pipe } from 'ramda'
import { CURRENT_NETWORK } from '../../src/network'

export type FungibleResourcesVaultCollection = Omit<
  FungibleResourcesCollection,
  'items'
> & {
  items: FungibleResourcesCollectionItemVaultAggregated[]
}

export type NonFungibleResourcesVaultCollection = Omit<
  NonFungibleResourcesCollection,
  'items'
> & {
  items: NonFungibleResourcesCollectionItemVaultAggregated[]
}

export type StateEntityDetailsVaultResponseItem =
  StateEntityDetailsResponseItem & {
    fungible_resources: FungibleResourcesVaultCollection
    non_fungible_resources: NonFungibleResourcesVaultCollection
  }

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
    encodedManifest: res.details.raw_hex,
    receipt: res.details.receipt,
    referencedEntities: res.details.referenced_global_entities,
    createdEntities: (res.details.receipt as any).state_updates
      .new_global_entities as { global_address: string }[],
    stateVersion: res.transaction.state_version
  }))
)

export const getEntityDetails = (addresses: string[]) =>
  stateApi
    .stateEntityDetails({
      stateEntityDetailsRequest: {
        addresses,
        aggregation_level: 'Vault'
      }
    })
    .then(({ items }) => items as StateEntityDetailsVaultResponseItem[])

export const getEntityNonFungibleIDs = (
  accountAddress: string,
  nftAddress: string,
  vaultAddress: string
) =>
  stateApi.entityNonFungibleIdsPage({
    stateEntityNonFungibleIdsPageRequest: {
      address: accountAddress,
      vault_address: vaultAddress,
      resource_address: nftAddress
    }
  })

export const getEntityNonFungibleVaults = (
  accountAddress: string,
  resourceAddress: string
) =>
  stateApi.entityNonFungibleResourceVaultPage({
    stateEntityNonFungibleResourceVaultsPageRequest: {
      address: accountAddress,
      resource_address: resourceAddress
    }
  })

export const getNonFungibleData = (address: string, id: string) =>
  stateApi.nonFungibleData({
    stateNonFungibleDataRequest: {
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
