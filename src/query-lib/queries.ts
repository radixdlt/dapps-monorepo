import { makeQueries } from 'svelte-samlat'
import { networkConfig } from '@constants'
import {
  Configuration,
  StateApi,
  TransactionApi
} from '@radixdlt/babylon-gateway-api-sdk'
import { getWalletData } from '../wallet-sdk'
import {
  transformEntityOverview,
  transformEntityResources,
  type EntityResourcesTransformed
} from './transformations'

const config = new Configuration({ basePath: networkConfig?.url })

const stateApi = new StateApi(config)
const transactionApi = new TransactionApi(config)

export const requestAddresses = makeQueries({
  fn: async () => {
    const res = await getWalletData()({
      oneTimeAccountsWithoutProofOfOwnership: {}
    })
    if (res.isOk()) return res.value
    else throw Error(res.error.message)
  },
  decoder: (res) => res,
  transformationFn: (res) => res
})

export const getTransactionDetails = makeQueries({
  fn: async (params: { txID: string; stateVersion?: number }) =>
    transactionApi.transactionCommittedDetails({
      transactionCommittedDetailsRequest: {
        transaction_identifier: {
          type: 'intent_hash',
          value_hex: params.txID
        },
        ...(params.stateVersion
          ? {
              at_ledger_state: {
                state_version: params.stateVersion
              }
            }
          : {})
      }
    }),

  decoder: (res) => res,
  transformationFn: (res) => ({
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
  })
})

export const getEntityOverview = makeQueries({
  fn: async (
    resources:
      | EntityResourcesTransformed['fungible']
      | EntityResourcesTransformed['nonFungible']
  ) => {
    const entityAddresses = resources?.map((entity) => entity.address)
    const res = await stateApi.entityOverview({
      entityOverviewRequest: {
        addresses: entityAddresses || []
      }
    })
    return { res, resources }
  },
  decoder: (res) => ({ overview: res.res, resources: res.resources }),
  transformationFn: transformEntityOverview
})

export const getEntityResources = makeQueries({
  fn: async (address: string) =>
    stateApi.entityResources({
      entityResourcesRequest: {
        address
      }
    }),
  decoder: (res) => res,
  transformationFn: transformEntityResources
})

export const getEntityDetails = makeQueries({
  fn: (address: string) =>
    stateApi.entityDetails({
      entityDetailsRequest: {
        address
      }
    }),
  decoder: (res) => res,
  transformationFn: (res) => res
})

export const getEntityNonFungibleIDs = makeQueries({
  fn: (params: { accountAddress: string; nftAddress: string }) =>
    stateApi.entityNonFungibleIds({
      entityNonFungibleIdsRequest: {
        address: params.accountAddress,
        resource_address: params.nftAddress
      }
    }),
  decoder: (res) => res,
  transformationFn: (res) => res
})

export const getNonFungibleData = makeQueries({
  fn: (params: { address: string; id: string }) =>
    stateApi.nonFungibleIdData({
      nonFungibleDataRequest: {
        address: params.address,
        non_fungible_id: params.id
      }
    }),
  decoder: (res) => res,
  transformationFn: (res) => res
})

export const getNonFungibleIDs = makeQueries({
  fn: (address: string) =>
    stateApi.nonFungibleIds({
      nonFungibleIdsRequest: {
        address
      }
    }),
  decoder: (res) => res,
  transformationFn: (res) => res
})
