import type { _Entity } from '.'
import { getStandardMetadataEntry, getStringMetadata } from '../metadata'
import type { FungibleResource } from './resource'

export type PoolUnit = FungibleResource & _Entity<[['pool', string]]>

const resourceToPoolUnit = (resource: FungibleResource): PoolUnit => ({
  ...resource,
  metadata: {
    ...resource.metadata,
    standard: {
      ...resource.metadata.standard,
      pool: getStandardMetadataEntry(
        'pool',
        getStringMetadata
      )({ items: resource.metadata.all })
    }
  }
})

export const isPoolUnit = (resource: FungibleResource) =>
  getStringMetadata('pool')({ items: resource.metadata.all }) !== ''

export const getPoolUnits = (resources: FungibleResource[]) =>
  resources.filter(isPoolUnit).map(resourceToPoolUnit)
