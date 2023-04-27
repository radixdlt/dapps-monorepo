import {
  getEntityDetails,
  type NonFungibleResourcesVaultCollection,
  type FungibleResourcesVaultCollection,
  getEntityNonFungibleIDs,
  type StateEntityDetailsVaultResponseItem
} from '@api/gateway'
import type {
  EntityMetadataCollection,
  NonFungibleResourcesCollectionItemVaultAggregated,
  StateEntityDetailsResponseItem
} from '@radixdlt/babylon-gateway-api-sdk'
import { accountLabel, getNFTAddress } from '@utils'
import { andThen, pipe } from 'ramda'

type _Resource<T extends 'fungible' | 'non-fungible'> = {
  type: T
  address: string
  label: string
  name?: string
}

export type FungibleResource = _Resource<'fungible'> & {
  value: number
}

export type NonFungibleResource = _Resource<'non-fungible'> & {
  id: string
}

export type Resource = FungibleResource | NonFungibleResource

export type DecoratedAccount = Awaited<
  ReturnType<typeof getAccountData>
>[number]

const fungibleResourceDisplayLabel = (
  resource: StateEntityDetailsResponseItem
) =>
  pipe(
    () => [
      getStringMetadata('symbol')(resource.metadata),
      getStringMetadata('name')(resource.metadata)
    ],
    ([symbol, name]) =>
      symbol && name
        ? `${name} (${symbol})`
        : symbol || name || resource.address
  )()

const nonFungibleResourceDisplayLabel = (
  resource: StateEntityDetailsResponseItem,
  id: string
) =>
  pipe(
    () => getStringMetadata('name')(resource.metadata),
    (name) =>
      name
        ? `${accountLabel({
            address: getNFTAddress(resource.address, id),
            label: name || ''
          })}`
        : `${getNFTAddress(resource.address, id)}`
  )()

export const getStringMetadata =
  (key: string) => (metadata?: EntityMetadataCollection) =>
    metadata?.items.find((item) => item.key === key)?.value?.as_string

export const getVectorMetadata =
  (key: string) => (metadata?: EntityMetadataCollection) =>
    metadata?.items.find((item) => item.key === key)?.value
      ?.as_string_collection

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

    for (const { non_fungible_id } of entityIds.items) {
      ids.push(non_fungible_id)
    }
  }

  return ids
}

const transformNonFungible = async (
  nonFungibles: NonFungibleResourcesVaultCollection,
  accountAddress: string
) => {
  if (nonFungibles.items.length === 0) {
    return []
  }

  const transformedNonFungibles: NonFungibleResource[] = []

  const nonFungibleEntities = await getEntityDetails(
    nonFungibles.items.map(({ resource_address }) => resource_address)
  )

  for (const nonFungible of nonFungibles.items) {
    const ids = await getNonFungibleIds(accountAddress, nonFungible)
    const entity = nonFungibleEntities.find(
      ({ address }) => address === nonFungible.resource_address
    )!

    for (const id of ids) {
      transformedNonFungibles.push({
        type: 'non-fungible',
        label: nonFungibleResourceDisplayLabel(entity, id),
        id,
        address: `${entity.address}`,
        name: getStringMetadata('name')(entity.metadata)
      })
    }
  }

  return transformedNonFungibles
}

const transformFungible = async (
  fungibles: FungibleResourcesVaultCollection
): Promise<FungibleResource[]> => {
  if (fungibles.items.length === 0) {
    return []
  }

  const fungibleEntities = await getEntityDetails(
    fungibles.items.map(({ resource_address }) => resource_address)
  )

  return fungibleEntities.map((entity) => {
    const vaults = fungibles.items.find(
      ({ resource_address }) => resource_address === entity.address
    )?.vaults

    return {
      type: 'fungible',
      label: fungibleResourceDisplayLabel(entity),
      value:
        vaults?.items.reduce(
          (prev: any, next) => prev + Number(next.amount),
          0
        ) || 0,
      address: entity.address,
      name: getStringMetadata('name')(entity.metadata)
    }
  })
}

const transformResources = (items: StateEntityDetailsVaultResponseItem[]) =>
  Promise.all(
    items.map(async (item) => {
      const {
        non_fungible_resources = { items: [] },
        fungible_resources = { items: [] },
        address
      } = item

      const fungible = await transformFungible(fungible_resources)
      const nonFungible = await transformNonFungible(
        non_fungible_resources,
        address
      )

      return {
        accountAddress: item.address,
        details: item,
        fungible,
        nonFungible
      }
    })
  )

const getResource =
  (type: 'fungible' | 'nonFungible') =>
  (name: string) =>
  (resources: Omit<Resources[number], 'details' | 'accountAddress'>) =>
    // @ts-ignore
    resources[type].find((resource: Resource) => resource.name === name)

export type Resources = Awaited<ReturnType<typeof getAccountData>>

export const getFungibleResource = getResource('fungible')
export const getNonFungibleResource = getResource('nonFungible')

export const getAccountData = (accounts: string[]) =>
  pipe(() => getEntityDetails(accounts), andThen(transformResources))()
