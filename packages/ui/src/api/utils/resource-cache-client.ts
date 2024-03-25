import { ResultAsync, okAsync } from 'neverthrow'
import { BehaviorSubject, combineLatest, map, distinctUntilChanged } from 'rxjs'
import { callApi } from '@api/gateway'
import {
  transformFungibleResource,
  transformNonFungibleResource,
  type FungibleResource,
  type NftGlobalId,
  type NonFungibleResource
} from '../_deprecated/utils/entities/resource'
import { transformNft, type NonFungible, type NonFungibleAddress } from './nfts'
import type {
  StateEntityDetailsResponseItem,
  StreamTransactionsResponse
} from '@common/gateway-sdk'
import { addValidator } from '@api/_deprecated/utils/add-validator'

export type ValidatorExtension = {
  validator?: StateEntityDetailsResponseItem & { name?: string }
}

export type ResourceCacheClient = ReturnType<typeof ResourceCacheClient>
export const ResourceCacheClient = () => {
  const isLoadingFungibles = new BehaviorSubject<boolean>(false)
  const isLoadingNonFungibles = new BehaviorSubject<boolean>(false)
  const isLoadingNonFungiblesData = new BehaviorSubject<boolean>(false)

  const queriedResources = new Set<string>()

  const fungibleResources = new Map<
    string,
    FungibleResource & ValidatorExtension
  >()
  const nonFungibleResources = new Map<
    string,
    NonFungibleResource & ValidatorExtension
  >()
  const NonFungibles = new Map<
    NonFungibleAddress['nonFungibleAddress'],
    NonFungible
  >()

  const queryFungibles = (addresses: string[]) => {
    const addressesToQuery = addresses.filter(
      (address) => !queriedResources.has(address)
    )
    addressesToQuery.forEach((address) => queriedResources.add(address))

    if (addressesToQuery.length === 0) {
      return okAsync([])
    }

    isLoadingFungibles.next(true)

    return callApi('getEntityDetailsVaultAggregated', addressesToQuery)
      .andThen((entities) =>
        ResultAsync.combine(
          entities.map((entity) =>
            addValidator(transformFungibleResource(entity))
          )
        )
      )
      .map((entities) => {
        entities.forEach((entity) => {
          fungibleResources.set(entity.address, entity)
        })
        isLoadingFungibles.next(false)
      })
  }

  const queryNonFungiblesData = (
    addresses: NonFungibleAddress['nonFungibleAddress'][]
  ) => {
    const addressesToQuery = addresses.filter(
      (address) => !queriedResources.has(address)
    )
    addresses.forEach((address) => queriedResources.add(address))

    if (addressesToQuery.length === 0) {
      return okAsync([])
    }

    isLoadingNonFungiblesData.next(true)

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

    return ResultAsync.combine(
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
    ).map((data) => {
      isLoadingNonFungiblesData.next(false)
      return data
    })
  }

  const queryNonFungibles = (addresses: string[]) => {
    const addressesToQuery = addresses.filter(
      (address) => !queriedResources.has(address)
    )
    addresses.forEach((address) => queriedResources.add(address))

    if (addressesToQuery.length === 0) {
      return okAsync([])
    }

    isLoadingNonFungibles.next(true)

    return callApi('getEntityDetailsVaultAggregated', addressesToQuery)
      .andThen((entities) =>
        ResultAsync.combine(
          entities.map((entity) =>
            addValidator(transformFungibleResource(entity))
          )
        )
      )
      .map((entities) => {
        entities.forEach((entity) => {
          nonFungibleResources.set(
            entity.address,
            entity as unknown as NonFungibleResource
          )
        })
        isLoadingNonFungibles.next(false)
      })
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
    nonFungibleResourcesData: NonFungibles,
    isLoading$: combineLatest([
      isLoadingFungibles.asObservable(),
      isLoadingNonFungibles.asObservable(),
      isLoadingNonFungiblesData.asObservable()
    ]).pipe(
      map(
        ([isFungiblesLoading, isNonFungiblesLoading, isDataLoading]) =>
          isFungiblesLoading || isNonFungiblesLoading || isDataLoading
      ),
      distinctUntilChanged()
    )
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

export const fillResourceCacheWithTransactionsData = (
  streamTransactions: StreamTransactionsResponse
): void => {
  const uniqueNfts = new Set<string>()
  const uniqueFungibleTokens = new Set<string>()
  const uniqueLocalNfts = new Set<NftGlobalId>()

  streamTransactions.items.forEach((transactionInfo) => {
    transactionInfo.balance_changes?.fungible_balance_changes?.forEach(
      (change) => {
        uniqueFungibleTokens.add(change.resource_address)
      }
    )

    transactionInfo.balance_changes?.non_fungible_balance_changes?.forEach(
      (change) => {
        uniqueNfts.add(change.resource_address)
        ;[...change.added, ...change.removed].forEach((localId) => {
          uniqueLocalNfts.add(`${change.resource_address}:${localId}`)
        })
      }
    )
  })

  Promise.all([
    resourcesCacheClient.queryFungibles(Array.from(uniqueFungibleTokens)),
    resourcesCacheClient.queryNonFungibles(Array.from(uniqueNfts)),
    resourcesCacheClient.queryNonFungiblesData(Array.from(uniqueLocalNfts))
  ])
}
