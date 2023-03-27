import { getEntitiesDetails, getEntityDetails } from '@api/gateway'
import type {
  EntityMetadataCollection,
  FungibleResourcesCollection,
  FungibleResourcesCollectionItemGloballyAggregated,
  FungibleResourcesCollectionItemVaultAggregated,
  NonFungibleResourcesCollection,
  NonFungibleResourcesCollectionItemGloballyAggregated,
  StateEntityDetailsResponseItem
} from '@radixdlt/babylon-gateway-api-sdk'
import { accountLabel, getNFTAddress } from '@utils'
import { andThen, pipe } from 'ramda'

const fungibleResourceDisplayLabel = (
  resource: StateEntityDetailsResponseItem
) =>
  pipe(
    () => [
      getMetadata('symbol')(resource.metadata),
      getMetadata('name')(resource.metadata)
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
    () => getMetadata('name')(resource.metadata),
    (name) =>
      name
        ? `${accountLabel({
            address: getNFTAddress(resource.address, id),
            label: name || ''
          })}`
        : `${getNFTAddress(resource.address, id)}`
  )()

export const getMetadata =
  (key: string) => (metadata?: EntityMetadataCollection) =>
    metadata?.items.find((item) => item.key === key)?.value?.as_string

const transformNonFungible = async (
  nonFungible: NonFungibleResourcesCollection
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
    nonFungible.items as NonFungibleResourcesCollectionItemGloballyAggregated[]
  ).map(({ resource_address, non_fungible_id }) => {
    const entity = nonFungiblesMap[
      resource_address
    ] as StateEntityDetailsResponseItem
    return {
      label: nonFungibleResourceDisplayLabel(entity, non_fungible_id),
      value: non_fungible_id,
      address: `${entity.address}:${non_fungible_id}`,
      name: getMetadata('name')(entity.metadata)
    }
  })
}

const transformFungible = async (fungible: FungibleResourcesCollection) => {
  const fungibleEntities = await getEntitiesDetails(
    fungible.items.map(({ resource_address }) => resource_address)
  )

  return fungibleEntities.items.map((entity) => ({
    label: fungibleResourceDisplayLabel(entity),
    value: (
      fungible.items.find(
        ({ resource_address }) => resource_address === entity.address
      ) as FungibleResourcesCollectionItemVaultAggregated
    ).vaults.items.reduce(
      (prev, next) => (prev + Number(next.amount)) as number,
      0
    ),
    address: entity.address,
    name: getMetadata('name')(entity.metadata)
  }))
}

const getOverview =
  (accountAddress: string) => async (item: StateEntityDetailsResponseItem) => {
    const {
      non_fungible_resources = { items: [] },
      fungible_resources = { items: [] }
    } = item
    const fungible =
      fungible_resources.items.length > 0
        ? await transformFungible(fungible_resources)
        : []

    const nonFungible =
      non_fungible_resources.items.length > 0
        ? await transformNonFungible(non_fungible_resources)
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
