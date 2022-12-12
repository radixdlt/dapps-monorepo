import { makeQueries } from 'svelte-samlat'
import { networkConfig } from '@constants'
import {
  Configuration,
  TransactionApi,
  EntityApi
} from '@radixdlt/babylon-gateway-api-sdk'
import { decoders } from '@io'
import { getWalletSDK } from '../wallet-sdk'
import {
  transformEntityOverview,
  transformEntityResources,
  type EntityResourcesTransformed
} from './transformations'

const config = new Configuration({ basePath: networkConfig?.url })

const entityApi = new EntityApi(config)
const transactionApi = new TransactionApi(config)

export const requestAddresses = makeQueries({
  fn: async () => {
    const res = await getWalletSDK().getWalletData({
      oneTimeAccountsWithoutProofOfOwnership: {}
    })
    if (res.isOk()) return res.value
    else throw Error(res.error.message)
  },
  decoder: (res) => decoders('RequestAddressesIO', res),
  transformationFn: (res) => res
})

export const getTransactionDetails = makeQueries({
  fn: async (txID: string) =>
    transactionApi.transactionCommittedDetails({
      transactionCommittedDetailsRequest: {
        transaction_identifier: {
          type: 'intent_hash',
          value_hex: txID
        }
      }
    }),

  decoder: (res) => decoders('TransactionIO', res),
  transformationFn: async (res) => {
    return {
      status: res.transaction.transaction_status,
      date: res.transaction.confirmed_at,
      fee: res.transaction.fee_paid.value,
      message: res.details.message_hex,
      details: res.details.raw_hex
    }
  }
})

export const getEntityOverview = makeQueries({
  fn: async (
    resources:
      | EntityResourcesTransformed['fungible']
      | EntityResourcesTransformed['nonFungible']
  ) => {
    const entityAddresses = resources?.map((entity) => entity.address)
    const res = await entityApi.entityOverview({
      entityOverviewRequest: {
        addresses: entityAddresses || []
      }
    })
    return { res, resources }
  },
  decoder: (res) => {
    const decodedRes = decoders('EntityOverviewIO', res.res)
    return { overview: decodedRes, resources: res.resources }
  },
  transformationFn: transformEntityOverview
})

export const getEntityResources = makeQueries({
  fn: async (address: string) =>
    entityApi.entityResources({
      entityResourcesRequest: {
        address
      }
    }),
  decoder: (res) => decoders('EntityResourcesIO', res),
  transformationFn: transformEntityResources
})

export const getEntityDetails = makeQueries({
  fn: (address: string) =>
    entityApi.entityDetails({
      entityDetailsRequest: {
        address
      }
    }),
  decoder: (res) => decoders('EntityDetailsIO', res),
  transformationFn: (res) => res
})
