import { callApi } from '@common/api/_deprecated/gateway'
import {
  transformFungibleResource,
  transformNonFungibleResource,
  type FungibleResource,
  type NftGlobalId,
  type NonFungibleResource
} from '../_deprecated/utils/entities/resource'
import { transformNft, type NonFungible, type NonFungibleAddress } from './nfts'
import type { StreamTransactionsResponse } from '@common/utils/gateway-sdk'

export type ResourceCacheClient = ReturnType<typeof ResourceCacheClient>
export const ResourceCacheClient = () => {
  const queriedResources = new Set<string>()

  const fungibleResources = new Map<string, FungibleResource>()
  const nonFungibleResources = new Map<string, NonFungibleResource>()
  const NonFungibles = new Map<
    NonFungibleAddress['nonFungibleAddress'],
    NonFungible
  >()

  const queryFungibles = (addresses: string[]) => {
    const addressesToQuery = addresses.filter(
      (address) => !queriedResources.has(address)
    )
    addresses.forEach((address) => queriedResources.add(address))

    return callApi('getEntityDetailsVaultAggregated', addressesToQuery).map(
      (entities) => {
        entities.forEach((entity) => {
          fungibleResources.set(
            entity.address,
            transformFungibleResource(entity)
          )
        })
      }
    )
  }

  const queryNonFungiblesData = (
    addresses: NonFungibleAddress['nonFungibleAddress'][]
  ) => {
    const addressesToQuery = addresses.filter(
      (address) => !queriedResources.has(address)
    )
    addresses.forEach((address) => queriedResources.add(address))

    const individualResources = new Map<string, string[]>()
    addressesToQuery.forEach((address) => {
      const [resourceAddress, nftId] = address.split(':')
      const resource = individualResources.get(resourceAddress)
      if (resource) {
        resource.push(nftId)
      } else {
        individualResources.set(resourceAddress, [nftId])
      }
    })

    return Promise.all(
      Array.from(individualResources.entries()).map(([address, nftIds]) =>
        callApi('getNonFungibleData', address, nftIds).map((data) => {
          data.forEach((nftDetails) => {
            NonFungibles.set(
              `${address}:${nftDetails.non_fungible_id}`,
              transformNft(address, nftDetails)
            )
          })
        })
      )
    )
  }

  const queryNonFungibles = (addresses: string[]) => {
    const addressesToQuery = addresses.filter(
      (address) => !queriedResources.has(address)
    )
    addresses.forEach((address) => queriedResources.add(address))

    return callApi('getEntityDetailsVaultAggregated', addressesToQuery).map(
      (entities) => {
        entities.forEach((entity) => {
          nonFungibleResources.set(
            entity.address,
            transformNonFungibleResource(entity)
          )
        })
      }
    )
  }

  const addFungibles = (resources: FungibleResource[]) => {
    resources.forEach(({ address }) => queriedResources.add(address))
    resources.forEach((resource) => {
      fungibleResources.set(resource.address, resource)
    })
  }

  const addNonFungibles = (resources: NonFungibleResource[]) => {
    resources.forEach(({ address }) => queriedResources.add(address))
    resources.forEach((resource) => {
      nonFungibleResources.set(resource.address, resource)
    })
  }

  const addNonFungiblesData = (resources: NonFungible[]) => {
    resources.forEach((resource) =>
      queriedResources.add(`${resource.address}:${resource.id}`)
    )
    resources.forEach((resource) => {
      NonFungibles.set(`${resource.address}:${resource.id}`, resource)
    })
  }

  return {
    queryFungibles,
    queryNonFungibles,
    queryNonFungiblesData,
    addFungibles,
    addNonFungibles,
    addNonFungiblesData,
    fungibleResources,
    nonFungibleResources,
    nonFungibleResourcesData: NonFungibles
  }
}

export const resourcesCacheClient = ResourceCacheClient()

export const queryAndCacheUniqueResources = (
  promise: Promise<StreamTransactionsResponse>
): Promise<StreamTransactionsResponse> => {
  const uniqueNfts = new Set<string>()
  const uniqueFungibleTokens = new Set<string>()
  return promise.then((res) => {
    res.items.forEach((transactionInfo) => {
      transactionInfo.balance_changes?.fungible_balance_changes?.forEach(
        (change) => {
          uniqueFungibleTokens.add(change.resource_address)
        }
      )

      transactionInfo.balance_changes?.non_fungible_balance_changes?.forEach(
        (change) => {
          uniqueNfts.add(change.resource_address)
        }
      )
    })
    return Promise.all([
      resourcesCacheClient.queryFungibles(Array.from(uniqueFungibleTokens)),
      resourcesCacheClient.queryNonFungibles(Array.from(uniqueNfts))
    ])
      .then(() => res)
      .catch(() => res)
  })
}
