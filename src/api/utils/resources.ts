import {
  getEntityNonFungibleIDs,
  getEntityOverview,
  getEntityResources
} from '@api/gateway'
import type {
  EntityMetadataCollection,
  EntityOverviewResponseEntityItem,
  EntityResourcesResponse
} from '@radixdlt/babylon-gateway-api-sdk'
import { accountLabel, getNFTAddress } from '@utils'
import { andThen, pipe } from 'ramda'

const fungibleResourceDisplayLabel = (
  resource: EntityOverviewResponseEntityItem
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
  resource: EntityOverviewResponseEntityItem,
  id: string
) =>
  pipe(
    () => getMetadata('name')(resource.metadata),
    (name) =>
      name
        ? `${accountLabel({
            address: getNFTAddress(resource.address, id),
            label: name
          })}`
        : `${getNFTAddress(resource.address, id)}`
  )()

export const getMetadata =
  (key: string) => (metadata: EntityMetadataCollection) =>
    metadata.items.find((item) => item.key === key)?.value

const transformNonFungible = async (
  nonFungible: EntityResourcesResponse['non_fungible_resources'],
  accountAddress: string
) => {
  const nonFungibleEntities = await getEntityOverview(
    nonFungible.items.map(({ address }) => address)
  ).then(({ entities }) => entities)

  const nonFungibleIds = await Promise.all(
    nonFungibleEntities.map(async (entity) => {
      const { non_fungible_ids } = await getEntityNonFungibleIDs(
        accountAddress,
        entity.address
      )
      return non_fungible_ids.items.map(({ non_fungible_id }) => ({
        label: nonFungibleResourceDisplayLabel(entity, non_fungible_id),
        value: non_fungible_id,
        address: `${entity.address}:${non_fungible_id}`,
        name: getMetadata('name')(entity.metadata)
      }))
    })
  )

  return nonFungibleIds.flat()
}

const transformFungible = async (
  fungible: EntityResourcesResponse['fungible_resources']
) => {
  const fungibleEntities = await getEntityOverview(
    fungible.items.map(({ address }) => address)
  ).then(({ entities }) => entities)

  return fungibleEntities.map((entity) => ({
    label: fungibleResourceDisplayLabel(entity),
    value: fungible.items.find(({ address }) => address === entity.address)!
      .amount.value,
    address: entity.address,
    name: getMetadata('name')(entity.metadata)
  }))
}

const getOverview =
  (accountAddress: string) =>
  async ({
    non_fungible_resources,
    fungible_resources
  }: EntityResourcesResponse) => {
    const fungible =
      fungible_resources.items.length > 0
        ? await transformFungible(fungible_resources)
        : []

    const nonFungible =
      non_fungible_resources.items.length > 0
        ? await transformNonFungible(non_fungible_resources, accountAddress)
        : []

    return { fungible, nonFungible }
  }

const getResource =
  (type: 'fungible' | 'nonFungible') =>
  (name: string) =>
  (resources: Resources) =>
    resources[type].find((resource) => resource.name === name)

export type Resources = Awaited<ReturnType<typeof getPopulatedResources>>

export const getFungibleResource = getResource('fungible')
export const getNonFungibleResource = getResource('nonFungible')

export const getPopulatedResources = (accountAddress: string) =>
  pipe(
    () => getEntityResources(accountAddress),
    andThen(getOverview(accountAddress))
  )()
