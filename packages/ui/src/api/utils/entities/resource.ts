import {
  getEntityDetails,
  getEntityNonFungibleIDs,
  getSingleEntityDetails
} from '@api/gateway'
import type {
  EntityMetadataItem,
  FungibleResourcesCollectionItemVaultAggregated,
  FungibleResourcesVaultCollection,
  LedgerStateSelector,
  NonFungibleResourcesCollectionItemVaultAggregated,
  NonFungibleResourcesVaultCollection,
  StateEntityDetailsOptions,
  StateEntityDetailsResponseFungibleResourceDetails,
  StateEntityDetailsResponseItem,
  StateEntityDetailsVaultResponseItem,
  StateNonFungibleDetailsResponseItem
} from '@radixdlt/babylon-gateway-api-sdk'
import {
  andThen,
  filter,
  flatten,
  ifElse,
  isNil,
  map,
  pick,
  pipe,
  reject
} from 'ramda'
import { BigNumber } from 'bignumber.js'
import { getNonFungibleData } from '@api/gateway'
import { transformMetadata } from '../metadata'
import type { _Entity } from '.'
import { transformNft, type _NonFungible, type NonFungible } from '../nfts'
import { isPoolUnit, resourceToPoolUnit } from './pool-unit'

type _Resource<T extends 'fungible' | 'non-fungible'> = _Entity<
  'resource',
  ['name', 'symbol', 'icon_url', 'description', 'tags']
> & {
  resourceType: T
  totalSupply: string
  divisibility: number
  metadata: {
    explicit: EntityMetadataItem[]
  }
}

export type FungibleResource = _Resource<'fungible'> & {
  value: string
}

export type NonFungibleResource = _Resource<'non-fungible'>

export type Resource = FungibleResource | NonFungibleResource

export type DecoratedAccount = Awaited<
  ReturnType<typeof getAccountData>
>[number]

const getNonFungibleIds = async (
  accountAddress: string,
  nonFungibleResource: NonFungibleResourcesCollectionItemVaultAggregated
) => {
  const ids: string[] = []

  for (const vault of nonFungibleResource.vaults.items) {
    const entityIds = await getEntityNonFungibleIDs(
      accountAddress,
      nonFungibleResource.resource_address,
      vault.vault_address
    )

    ids.push(...entityIds.items)
  }

  return ids
}

export const transformNonFungibleResource = (
  entity: StateEntityDetailsResponseItem
): NonFungibleResource =>
  ({
    type: 'resource',
    resourceType: 'non-fungible',
    address: `${entity.address}`,
    totalSupply: (
      entity.details as StateEntityDetailsResponseFungibleResourceDetails
    ).total_supply,
    divisibility: (
      entity.details as StateEntityDetailsResponseFungibleResourceDetails
    ).divisibility,
    metadata: transformMetadata(entity, [
      'name',
      'symbol',
      'icon_url',
      'description',
      'tags'
    ])
  } as const)

export const transformFungibleResource = (
  entity: StateEntityDetailsResponseItem,
  fungible?: FungibleResourcesCollectionItemVaultAggregated
): FungibleResource =>
  ({
    type: 'resource',
    resourceType: 'fungible',
    value:
      fungible?.vaults.items
        .reduce((prev, next) => prev.plus(next.amount), new BigNumber(0))
        .toString() || '0',
    address: entity.address,
    totalSupply: (
      entity.details as StateEntityDetailsResponseFungibleResourceDetails
    ).total_supply,
    divisibility: (
      entity.details as StateEntityDetailsResponseFungibleResourceDetails
    ).divisibility,
    metadata: transformMetadata(entity, [
      'name',
      'symbol',
      'icon_url',
      'description',
      'tags'
    ])
  } as const)

export type TransformedNonFungible = {
  resource: NonFungibleResource
  ownedNonFungibles: number
  nonFungibles: (NonFungible | NonFungible['id'])[]
  nextCursor?: string
  vaultAddress: string
}

const transformNonFungible = async (
  items: NonFungibleResourcesVaultCollection['items'],
  stateOptions?: StateEntityDetailsOptions,
  ledgerState?: LedgerStateSelector,
  getNonFungiblesForResources?: string[]
) => {
  if (items.length === 0) {
    return []
  }

  const transformedNonFungibles: TransformedNonFungible[] = []

  const nonFungibleEntities = await getEntityDetails(
    items.map(({ resource_address }) => resource_address),
    stateOptions,
    ledgerState
  )

  for (const nonFungible of items) {
    const ids = pipe(
      () => nonFungible.vaults.items,
      map(({ items }) => items),
      (items) => reject(isNil, items),
      flatten
    )()

    const entity = nonFungibleEntities.find(
      ({ address }) => address === nonFungible.resource_address
    )!

    let nftData: StateNonFungibleDetailsResponseItem[] = []

    let length = transformedNonFungibles.push({
      ownedNonFungibles: nonFungible.vaults.items.reduce((sum, vault) => {
        return sum + vault.total_count
      }, 0),
      resource: transformNonFungibleResource(entity),
      nonFungibles: ids,
      nextCursor: nonFungible.vaults.items[0].next_cursor || undefined,
      vaultAddress: nonFungible.vaults.items[0].vault_address
    })

    if (
      !getNonFungiblesForResources ||
      (getNonFungiblesForResources &&
        getNonFungiblesForResources.includes(nonFungible.resource_address))
    ) {
      nftData = await getNonFungibleData(nonFungible.resource_address, ids)

      for (const singleNftData of nftData) {
        transformedNonFungibles[length - 1].nonFungibles.push(
          transformNft(nonFungible.resource_address, singleNftData)
        )
      }
    }
  }

  return transformedNonFungibles
}

export const transformFungible = async (
  items: FungibleResourcesVaultCollection['items'],
  stateOptions?: StateEntityDetailsOptions,
  ledgerState?: LedgerStateSelector
): Promise<FungibleResource[]> => {
  if (items.length === 0) {
    return []
  }

  const fungibleEntities = await getEntityDetails(
    items.map(({ resource_address }) => resource_address),
    stateOptions,
    ledgerState
  )

  return fungibleEntities.map((entity) => {
    const fungible = items.find(
      ({ resource_address }) => resource_address === entity.address
    )!

    return transformFungibleResource(entity, fungible)
  })
}

export const transformResource = (entity: StateEntityDetailsResponseItem) => {
  if (entity.details?.type === 'FungibleResource') {
    const fungible = transformFungibleResource(entity)
    if (isPoolUnit(fungible)) {
      return resourceToPoolUnit(fungible)
    }
    return fungible
  }

  return transformNonFungibleResource(entity)
}

export const transformResources =
  (
    stateOptions?: StateEntityDetailsOptions,
    ledgerState?: LedgerStateSelector,
    getNonFungiblesForResources?: string[]
  ) =>
  async (
    items: StateEntityDetailsVaultResponseItem[],
    options?: Partial<{ fungibles: boolean; nfts: boolean }>
  ) => {
    const { fungibles = true, nfts = true } = options || {}

    const resources = items.map(
      pick(['fungible_resources', 'non_fungible_resources'])
    )

    const fungibleItems = resources
      .map(({ fungible_resources: { items } }) => items)
      .flat()
    const nonFungibleItems = resources
      .map(({ non_fungible_resources: { items } }) => items)
      .flat()

    const fungible = fungibles
      ? await transformFungible(fungibleItems, stateOptions, ledgerState)
      : []

    const nonFungible = nfts
      ? await transformNonFungible(
          nonFungibleItems,
          stateOptions,
          ledgerState,
          getNonFungiblesForResources
        )
      : []

    return items.map((item) => ({
      accountAddress: item.address,
      details: item,
      fungible: fungible.filter(({ address }) =>
        item.fungible_resources.items.some(
          ({ resource_address }) => resource_address === address
        )
      ),
      nonFungible: nonFungible.filter(({ resource: { address } }) =>
        item.non_fungible_resources.items.some(
          ({ resource_address }) => resource_address === address
        )
      )
    }))
  }

const getResource =
  <T extends 'fungible' | 'nonFungible'>(type: T) =>
  (name: string) =>
  (
    resources: Omit<Resources[number], 'details' | 'accountAddress'>
  ): T extends 'fungible' ? FungibleResource : NonFungibleResource =>
    // @ts-ignore
    resources[type].find((resource: Resource) => resource.name === name)

export type Resources = Awaited<ReturnType<typeof getAccountData>>

export const getFungibleResource = getResource('fungible')
export const getNonFungibleResource = getResource('nonFungible')

export const getAccountData = (
  accounts: string[],
  options?: StateEntityDetailsOptions,
  ledgerState?: LedgerStateSelector,
  getNonFungiblesForResources?: string[]
) =>
  pipe(
    () => getEntityDetails(accounts, options, ledgerState),
    andThen(
      transformResources(options, ledgerState, getNonFungiblesForResources)
    )
  )()

export const getAccountFungibleTokens = (accounts: string) =>
  pipe(
    () => getSingleEntityDetails(accounts),
    andThen((data) =>
      transformResources()([data], { nfts: false, fungibles: true })
    ),
    andThen((data) => data[0])
  )()
