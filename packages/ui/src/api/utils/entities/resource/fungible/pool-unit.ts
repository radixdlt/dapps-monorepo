import type { _Entity } from '../..'
import { transformMetadata, createSystemMetadata } from '../../../metadata'
import type { FungibleResource } from '.'
import type {
  NativeResourceMultiResourcePoolUnitValue,
  NativeResourceOneResourcePoolUnitValue,
  NativeResourceTwoResourcePoolUnitValue
} from '@common/gateway-sdk'

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
