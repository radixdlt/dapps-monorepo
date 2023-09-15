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
  StateEntityDetailsVaultResponseItem
} from '@radixdlt/babylon-gateway-api-sdk'
import { andThen, pipe } from 'ramda'
import { BigNumber } from 'bignumber.js'
import { getNonFungibleData } from '@api/gateway'
import { transformMetadata } from '../metadata'
import type { _Entity } from '.'
import { transformNft, type _NonFungible, type NonFungible } from '../nfts'

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
  entity: StateEntityDetailsVaultResponseItem
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
  nonFungibles: NonFungible[]
  nextCursor?: string
  vaultAddress: string
}

const transformNonFungible = async (
  nonFungibles: NonFungibleResourcesVaultCollection,
  accountAddress: string,
  stateOptions?: StateEntityDetailsOptions,
  ledgerState?: LedgerStateSelector
) => {
  if (nonFungibles.items.length === 0) {
    return []
  }

  const transformedNonFungibles: TransformedNonFungible[] = []

  const nonFungibleEntities = await getEntityDetails(
    nonFungibles.items.map(({ resource_address }) => resource_address),
    stateOptions,
    ledgerState
  )

  for (const nonFungible of nonFungibles.items) {
    const ids = await getNonFungibleIds(accountAddress, nonFungible)
    const entity = nonFungibleEntities.find(
      ({ address }) => address === nonFungible.resource_address
    )!

    const nftData = await getNonFungibleData(nonFungible.resource_address, ids)

    let length = transformedNonFungibles.push({
      ownedNonFungibles: nonFungible.vaults.items.reduce((sum, vault) => {
        return sum + vault.total_count
      }, 0),
      resource: transformNonFungibleResource(entity),
      nonFungibles: [],
      nextCursor: nonFungible.vaults.items[0].next_cursor || undefined,
      vaultAddress: nonFungible.vaults.items[0].vault_address
    })

    for (const singleNftData of nftData) {
      transformedNonFungibles[length - 1].nonFungibles.push(
        transformNft(nonFungible.resource_address, singleNftData)
      )
    }
  }

  return transformedNonFungibles
}

export const transformFungible = async (
  fungibles: FungibleResourcesVaultCollection,
  stateOptions?: StateEntityDetailsOptions,
  ledgerState?: LedgerStateSelector
): Promise<FungibleResource[]> => {
  if (fungibles.items.length === 0) {
    return []
  }

  const fungibleEntities = await getEntityDetails(
    fungibles.items.map(({ resource_address }) => resource_address),
    stateOptions,
    ledgerState
  )

  return fungibleEntities.map((entity) => {
    const fungible = fungibles.items.find(
      ({ resource_address }) => resource_address === entity.address
    )!

    return transformFungibleResource(entity, fungible)
  })
}

export const transformResources =
  (stateOptions?: StateEntityDetailsOptions) =>
  (ledgerState?: LedgerStateSelector) =>
  (
    items: StateEntityDetailsVaultResponseItem[],
    options?: Partial<{ fungibles: boolean; nfts: boolean }>
  ) => {
    const { fungibles = true, nfts = true } = options || {}
    return Promise.all(
      items.map(async (item) => {
        const {
          non_fungible_resources = { items: [] },
          fungible_resources = { items: [] },
          address
        } = item

        const fungible = fungibles
          ? await transformFungible(
              fungible_resources,
              stateOptions,
              ledgerState
            )
          : []
        const nonFungible = nfts
          ? await transformNonFungible(
              non_fungible_resources,
              address,
              stateOptions
            )
          : []
        return {
          accountAddress: item.address,
          details: item,
          fungible,
          nonFungible
        }
      })
    )
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
  ledgerState?: LedgerStateSelector
) =>
  pipe(
    () => getEntityDetails(accounts, options, ledgerState),
    andThen(transformResources(options)(ledgerState))
  )()

export const getAccountFungibleTokens = (accounts: string) =>
  pipe(
    () => getSingleEntityDetails(accounts),
    andThen((data) =>
      transformResources()()([data], { nfts: false, fungibles: true })
    ),
    andThen((data) => data[0])
  )()
