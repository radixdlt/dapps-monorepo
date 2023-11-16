import { callApi } from '@api/gateway'
import {
  transformFungibleResource,
  transformNonFungibleResource,
  type FungibleResource,
  type NftGlobalId,
  type NonFungibleResource
} from './entities/resource'
import { transformNft, type NonFungible } from './nfts'

export const ResourceCacheClient = () => {
  const queriedResources = new Set<string>()

  const fungibleResources = new Map<string, FungibleResource>()
  const nonFungibleResources = new Map<string, NonFungibleResource>()
  const nonFungibleResourcesData = new Map<NftGlobalId, NonFungible>()

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

  const queryNonFungiblesData = (addresses: NftGlobalId[]) => {
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
            nonFungibleResourcesData.set(
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
      nonFungibleResourcesData.set(
        `${resource.address}:${resource.id}`,
        resource
      )
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
    nonFungibleResourcesData
  }
}

export const resourcesCacheClient = ResourceCacheClient()
