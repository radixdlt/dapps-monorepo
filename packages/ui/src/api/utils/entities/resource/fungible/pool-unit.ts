import type { _Entity } from '../..'
import {
  getMetadataItem,
  transformMetadata,
  getStringMetadata,
  createSystemMetadata,
  getStringMetadataValue
} from '../../../metadata'
import type { FungibleResource } from '.'
import type {
  EntityMetadataCollection,
  NativeResourceMultiResourcePoolUnitValue,
  NativeResourceOneResourcePoolUnitValue,
  NativeResourceTwoResourcePoolUnitValue,
  StateEntityDetailsVaultResponseItem
} from '@common/gateway-sdk'
import { andThen, pipe } from 'ramda'

const systemMetadata = createSystemMetadata({
  pool: 'GlobalAddress'
})

type PoolUnitNativeResourceDetails =
  | NativeResourceOneResourcePoolUnitValue
  | NativeResourceTwoResourcePoolUnitValue
  | NativeResourceMultiResourcePoolUnitValue

export type PoolUnit = Omit<
  FungibleResource,
  'type' | 'nativeResourceDetails'
> &
  _Entity<'poolUnit', typeof systemMetadata> & {
    nativeResourceDetails: PoolUnitNativeResourceDetails
  }
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
  nativeResourceDetails:
    resource.nativeResourceDetails as PoolUnitNativeResourceDetails,
  type: 'poolUnit',
  metadata: {
    ...resource.metadata,
    expected: {
      ...resource.metadata.expected,
      ...transformMetadata(
        {
          metadata: {
            items: resource.metadata.all
          }
        },
        systemMetadata
      ).expected
    }
  }
})

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

export const getPoolUnits = (resources: FungibleResource[]) =>
  resources
    .filter((resource) => isPoolUnit(resource))
    .map((resource) => resourceToPoolUnit(resource))

export const isPoolUnit = (resource: FungibleResource) =>
  [
    'TwoResourcePoolUnit',
    'OneResourcePoolUnit',
    'MultiResourcePoolUnit'
  ].includes(resource.nativeResourceDetails?.kind || '')

export const getPoolUnitMetadataValue = (
  entity: StateEntityDetailsVaultResponseItem
) => getStringMetadata('pool_unit')(entity.metadata)
