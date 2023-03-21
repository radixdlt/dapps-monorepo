import {
  getEntitiesDetails,
  getEntityDetails,
  type NonFungibleResourcesVaultCollection,
  type FungibleResourcesVaultCollection,
  getEntityNonFungibleIDs
} from '@api/gateway'
import type {
  EntityMetadataCollection,
  NonFungibleResourcesCollectionItemVaultAggregated,
  StateEntityDetailsResponseItem
} from '@radixdlt/babylon-gateway-api-sdk'
import { accountLabel, getNFTAddress } from '@utils'
import { andThen, pipe } from 'ramda'

type ParsedResource = {
  address: string
  label: string
  value: string
  name: string
}

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

const transformNonFungible = async (
  nonFungible: NonFungibleResourcesVaultCollection,
  accountAddress: string
) => {
  const nonFungibleEntities = await getEntitiesDetails(
    nonFungible.items.map(({ resource_address }) => resource_address)
  )

  const nonFungiblesMap = nonFungibleEntities.items.reduce(
    (prev, next: StateEntityDetailsResponseItem) => {
      prev[next.address] = next
      return prev
    },
    {} as Record<string, StateEntityDetailsResponseItem>
  )

  return (
    await Promise.all(
      (
        nonFungible.items as NonFungibleResourcesCollectionItemVaultAggregated[]
      ).map(async ({ resource_address, vaults }) => {
        const vaultsValues = await Promise.all(
          vaults.items.map((vault) =>
            getEntityNonFungibleIDs(
              accountAddress,
              resource_address,
              vault.vault_address
            )
          )
        )

        const non_fungible_id = vaultsValues?.[0]?.items?.[0]?.non_fungible_id

        if (!non_fungible_id) {
          return undefined
        }

        const entity = nonFungiblesMap[
          resource_address
        ] as StateEntityDetailsResponseItem
        return {
          label: nonFungibleResourceDisplayLabel(entity, non_fungible_id),
          value: non_fungible_id,
          address: `${entity.address}:${non_fungible_id}`,
          name: getStringMetadata('name')(entity.metadata)
        }
      })
    )
  ).filter((nft): nft is ParsedResource => !!nft)
}

const transformFungible = async (
  fungible: FungibleResourcesVaultCollection
) => {
  const fungibleEntities = await getEntitiesDetails(
    fungible.items.map(({ resource_address }) => resource_address)
  )
  return fungibleEntities.items.map((entity) => {
    const vaults = fungible.items.find(
      ({ resource_address }) => resource_address === entity.address
    )?.vaults || { items: [] }
    return {
      label: fungibleResourceDisplayLabel(entity),
      value: vaults.items.reduce(
        (prev: any, next) => prev + Number(next.amount),
        0
      ),
      address: entity.address,
      name: getStringMetadata('name')(entity.metadata)
    }
  })
}

const getOverview =
  (accountAddress: string) => async (item: StateEntityDetailsResponseItem) => {
    const {
      non_fungible_resources = { items: [] },
      fungible_resources = { items: [] },
      address
    } = item
    const fungible =
      fungible_resources.items.length > 0
        ? await transformFungible(
            fungible_resources as FungibleResourcesVaultCollection
          )
        : []

    const nonFungible =
      non_fungible_resources.items.length > 0
        ? await transformNonFungible(
            non_fungible_resources as NonFungibleResourcesVaultCollection,
            address
          )
        : []

    return { accountAddress, item, fungible, nonFungible }
  }

const getResource =
  (type: 'fungible' | 'nonFungible') =>
  (name: string) =>
  (resources: Resources) =>
    resources[type].find((resource: any) => resource.name === name)

export type Resources = Awaited<ReturnType<typeof getPopulatedResources>>

export const getFungibleResource = getResource('fungible')
export const getNonFungibleResource = getResource('nonFungible')

export const getPopulatedResources = (accountAddress: string) =>
  pipe(
    () => getEntityDetails(accountAddress),
    andThen(getOverview(accountAddress))
  )()
