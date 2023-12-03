import { andThen, pipe } from 'ramda'
import type { _Entity } from '.'
import {
  getMetadataItem,
  getStringMetadataValue,
  transformMetadata
} from '../metadata'
import type { FungibleResource } from './resource'
import type {
  EntityMetadataCollection,
  StateEntityDetailsVaultResponseItem
} from '@common/gateway-sdk'

export type PoolUnit = Omit<FungibleResource, 'type'> &
  _Entity<'poolUnit', ['pool']>

export type GetEntityTypesFn = (
  address: string[]
) => Promise<{ [address: string]: string }>

export type GetEntityDetailsFn = (
  addresses: string[]
) => Promise<StateEntityDetailsVaultResponseItem[]>

type FungibleResourceWithPoolAddress = FungibleResource & {
  poolAddress: string
}

type PoolAddress = string
type ResourceAddress = string
type PoolResource = Record<PoolAddress, ResourceAddress>

export const resourceToPoolUnit = (resource: FungibleResource): PoolUnit => ({
  ...resource,
  type: 'poolUnit',
  metadata: {
    ...resource.metadata,
    standard: {
      ...resource.metadata.standard,
      ...transformMetadata(
        {
          metadata: {
            items: resource.metadata.all
          }
        },
        ['pool']
      ).standard
    }
  }
})

const getPoolAddress = (resource: FungibleResource) => {
  const poolMetadataEntry = getMetadataItem('pool')({
    items: resource.metadata.all
  })
  if (poolMetadataEntry?.value.typed.type === 'GlobalAddress')
    return poolMetadataEntry?.value.typed.value
}

export const hasPoolMetadataSet = (resource: FungibleResource) => {
  const poolMetadataEntry = getMetadataItem('pool')({
    items: resource.metadata.all
  })
  return (
    poolMetadataEntry?.value.typed.type === 'GlobalAddress' &&
    poolMetadataEntry?.value.typed.value.startsWith('pool_')
  )
}

const getPoolUnitValue = (metadata: EntityMetadataCollection) =>
  pipe(getMetadataItem('pool_unit'), (value) =>
    value ? getStringMetadataValue(value) : undefined
  )(metadata)

export const verify2WayLinking =
  (getEntityDetailsFn: GetEntityDetailsFn) =>
  (resources: FungibleResourceWithPoolAddress[]) =>
    pipe(
      getPoolAddresses,
      getEntityDetailsFn,
      andThen((poolEntities) =>
        poolEntities
          .map((poolEntityState) => ({
            address: poolEntityState.address,
            poolResource: getPoolUnitValue(poolEntityState.metadata)
          }))
          .filter(
            (value): value is { address: string; poolResource: string } =>
              !!value.poolResource
          )
          .reduce<PoolResource>(
            (acc, { address, poolResource }) => ({
              ...acc,
              [address]: poolResource
            }),
            {}
          )
      ),
      andThen((poolResources) =>
        resources.filter(
          (resource) => resource.address === poolResources[resource.poolAddress]
        )
      )
    )(resources)

const getPoolAddresses = (resources: FungibleResourceWithPoolAddress[]) =>
  resources.map(({ poolAddress }) => poolAddress)

const filterByEntityType =
  (validEntityTypes: Set<string>, getEntityTypesFn: GetEntityTypesFn) =>
  async (resources: FungibleResourceWithPoolAddress[]) =>
    pipe(
      getPoolAddresses,
      getEntityTypesFn,
      andThen((entityTypes) =>
        resources.filter(({ poolAddress }) => {
          const poolEntityType = entityTypes[poolAddress]
          return poolEntityType && validEntityTypes.has(poolEntityType)
        })
      )
    )(resources)

const extendWithPoolAddress = (resources: FungibleResource[]) =>
  resources.map((resource) => ({
    ...resource,
    poolAddress: getPoolAddress(resource)!
  }))

export const verifyPoolUnit =
  (
    getEntityTypesFn: GetEntityTypesFn,
    getEntityDetailsFn: GetEntityDetailsFn
  ) =>
  (resources: FungibleResource[]) =>
    pipe(
      (resources: FungibleResource[]) => resources.filter(hasPoolMetadataSet),
      extendWithPoolAddress,
      filterByEntityType(
        new Set([
          'GlobalOneResourcePool',
          'GlobalTwoResourcePool',
          'GlobalMultiResourcePool'
        ]),
        getEntityTypesFn
      ),
      andThen(verify2WayLinking(getEntityDetailsFn))
    )(resources)

export const getPoolUnits = (
  resources: FungibleResource[],
  getEntityTypesFn: GetEntityTypesFn,
  getEntityDetailsFn: GetEntityDetailsFn
) =>
  pipe(
    verifyPoolUnit(getEntityTypesFn, getEntityDetailsFn),
    andThen((resources) => resources.map(resourceToPoolUnit))
  )(resources)
