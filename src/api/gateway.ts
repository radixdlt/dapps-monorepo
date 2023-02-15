import { networkConfig } from '@constants'
import {
  Configuration,
  StateApi,
  TransactionApi
} from '@radixdlt/babylon-gateway-api-sdk'
import { andThen, pipe } from 'ramda'
import {
  transformEntityOverview,
  transformEntityResources,
  type EntityResourcesTransformed
} from './transformations'

const config = new Configuration({ basePath: networkConfig?.url })

const stateApi = new StateApi(config)
const transactionApi = new TransactionApi(config)

export const getTransactionDetails = pipe(
  (txID: string, stateVersion?: number) =>
    transactionApi.transactionCommittedDetails({
      transactionCommittedDetailsRequest: {
        transaction_identifier: {
          type: 'intent_hash',
          value_hex: txID
        },
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

export const getEntityOverview = pipe(
  async (
    resources:
      | EntityResourcesTransformed['fungible']
      | EntityResourcesTransformed['nonFungible']
  ) => {
    const res = await stateApi.entityOverview({
      entityOverviewRequest: {
        addresses: resources.map((r) => r.address)
      }
    })
    return { overview: res, resources }
  },
  andThen(transformEntityOverview)
)

export const getEntityResources = pipe(
  async (address: string) =>
    stateApi.entityResources({
      entityResourcesRequest: {
        address
      }
    }),
  andThen(transformEntityResources)
)

export const getEntityDetails = (address: string) =>
  stateApi.entityDetails({
    entityDetailsRequest: {
      address
    }
  })

export const getEntityNonFungibleIDs = (
  accountAddress: string,
  nftAddress: string
) =>
  stateApi.entityNonFungibleIds({
    entityNonFungibleIdsRequest: {
      address: accountAddress,
      resource_address: nftAddress
    }
  })

export const getNonFungibleData = (address: string, id: string) =>
  stateApi.nonFungibleIdData({
    nonFungibleDataRequest: {
      address: address,
      non_fungible_id: id
    }
  })

export const getNonFungibleIDs = (address: string) =>
  stateApi.nonFungibleIds({
    nonFungibleIdsRequest: {
      address
    }
  })

export const getOverview = (addresses: string[]) =>
  stateApi.entityOverview({
    entityOverviewRequest: {
      addresses
    }
  })
