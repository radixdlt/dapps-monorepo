import { andThen, map, pipe } from 'ramda'
import { accountLabel, getNFTAddress } from '@utils'
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

const fungibleResourceDisplayLabel = (
  resource: EntityOverviewResponseEntityItem
) =>
  pipe(
    () => [
      getMetadata(resource.metadata)('symbol'),
      getMetadata(resource.metadata)('name')
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
    () => getMetadata(resource.metadata)('name'),
    (name) =>
      name
        ? `${accountLabel({
            address: getNFTAddress(resource.address, id),
            label: name
          })}`
        : `${getNFTAddress(resource.address, id)}`
  )()

const getMetadata = (metadata: EntityMetadataCollection) => (key: string) =>
  metadata.items.find((item) => item.key === key)?.value

const getOverview =
  (accountAddress: string) =>
  async ({
    non_fungible_resources,
    fungible_resources
  }: EntityResourcesResponse) => {
    const fungible =
      fungible_resources.items.length > 0
        ? await pipe(
            () =>
              getEntityOverview(
                fungible_resources.items.map(({ address }) => address)
              ).then(({ entities }) => entities),
            andThen(
              map((entity) => ({
                label: fungibleResourceDisplayLabel(entity),
                value: fungible_resources.items.find(
                  ({ address }) => address === entity.address
                )?.amount.value,
                address: entity.address
              }))
            )
          )()
        : []

    const nonFungible: Array<{
      label: string
      value: string
      address: string
    }> = []

    const nonFungibleEntities = await getEntityOverview(
      non_fungible_resources.items.map(({ address }) => address)
    ).then(({ entities }) => entities)

    for (const entity of nonFungibleEntities) {
      const { non_fungible_ids } = await getEntityNonFungibleIDs(
        accountAddress,
        entity.address
      )
      for (const { non_fungible_id } of non_fungible_ids.items) {
        nonFungible.push({
          label: nonFungibleResourceDisplayLabel(entity, non_fungible_id),
          value: non_fungible_id,
          address: `${entity.address}:${non_fungible_id}`
        })
      }
    }

    return { fungible, nonFungible }
  }

export const getResources = (accountAddress: string) =>
  pipe(
    () => getEntityResources(accountAddress),
    andThen(getOverview(accountAddress))
  )()
