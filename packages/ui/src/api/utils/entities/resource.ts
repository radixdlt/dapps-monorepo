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
} from '@common/gateway-sdk'
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
  accountResourceItems: {
    account: string
    items: NonFungibleResourcesVaultCollection['items']
  }[],
  stateOptions?: StateEntityDetailsOptions,
  ledgerState?: LedgerStateSelector,
  getNonFungiblesForResources?: string[]
) => {
  if (accountResourceItems.length === 0) {
    return []
  }

  const allNonFungibleAddresses = pipe(
    () => accountResourceItems,
    map(({ items }) => items),
    flatten,
    map(({ resource_address }) => resource_address)
  )()

  const nonFungibleEntities = await getEntityDetails(
    allNonFungibleAddresses,
    stateOptions,
    ledgerState
  )

  return Promise.all(
    accountResourceItems.map(async ({ account, items }) => ({
      account,
      items: await Promise.all(
        items.map(async (item) => {
          const ids = pipe(
            () => item.vaults.items,
            map(({ items }) => items),
            (items) => reject(isNil, items),
            flatten
          )()

          const entity = nonFungibleEntities.find(
            ({ address }) => address === item.resource_address
          )!

          let nftData: StateNonFungibleDetailsResponseItem[] = []

          const transformedNonFungible: TransformedNonFungible = {
            ownedNonFungibles: item.vaults.items.reduce((sum, vault) => {
              return sum + vault.total_count
            }, 0),
            resource: transformNonFungibleResource(entity),
            nonFungibles: [],
            nextCursor: item.vaults.items[0].next_cursor || undefined,
            vaultAddress: item.vaults.items[0].vault_address
          }

          if (
            !getNonFungiblesForResources ||
            (getNonFungiblesForResources &&
              getNonFungiblesForResources.includes(item.resource_address))
          ) {
            nftData = await getNonFungibleData(item.resource_address, ids)

            for (const singleNftData of nftData) {
              transformedNonFungible.nonFungibles.push(
                transformNft(item.resource_address, singleNftData)
              )
            }
          } else {
            transformedNonFungible.nonFungibles = ids
          }
          return transformedNonFungible
        })
      )
    }))
  )
}

export const transformFungible = async (
  accountResourceItems: {
    account: string
    items: FungibleResourcesVaultCollection['items']
  }[],
  stateOptions?: StateEntityDetailsOptions,
  ledgerState?: LedgerStateSelector
): Promise<
  {
    account: string
    items: FungibleResource[]
  }[]
> => {
  if (accountResourceItems.length === 0) {
    return []
  }

  const allFungibleAddresses = pipe(
    () => accountResourceItems,
    map(({ items }) => items),
    flatten,
    map(({ resource_address }) => resource_address)
  )()

  const fungibleEntities = await getEntityDetails(
    allFungibleAddresses,
    stateOptions,
    ledgerState
  )

  return accountResourceItems.map((item) => ({
    account: item.account,
    items: item.items.map((fungible) => {
      const entity = fungibleEntities.find(
        ({ address }) => address === fungible.resource_address
      )!

      return transformFungibleResource(entity, fungible)
    })
  }))
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
    accountEntities: StateEntityDetailsVaultResponseItem[],
    options?: Partial<{ fungibles: boolean; nfts: boolean }>
  ) => {
    const { fungibles = true, nfts = true } = options || {}

    const resources = accountEntities.map(
      pick(['address', 'fungible_resources', 'non_fungible_resources'])
    )

    const fungibleItems = resources.map(
      ({ address, fungible_resources: { items } }) => ({
        account: address,
        items
      })
    )

    const nonFungibleItems = resources.map(
      ({ address, non_fungible_resources: { items } }) => ({
        account: address,
        items
      })
    )

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

    return accountEntities.map((accountEntity) => ({
      accountAddress: accountEntity.address,
      details: accountEntity,
      fungible: fungible.find(
        ({ account }) => account === accountEntity.address
      )!.items,
      nonFungible: nonFungible.find(
        ({ account }) => account === accountEntity.address
      )!.items
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
