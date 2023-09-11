import type { _Entity } from '.'
import { getStandardMetadataEntry, getStringMetadata } from '../metadata'
import type { FungibleResource } from './resource'

export type PoolUnit = Omit<FungibleResource, 'type'> &
  _Entity<'poolUnit', [['pool', string]]>

const resourceToPoolUnit = (resource: FungibleResource): PoolUnit => ({
  ...resource,
  type: 'poolUnit',
  metadata: {
    ...resource.metadata,
    standard: {
      ...resource.metadata.standard,
      pool: getStandardMetadataEntry(
        'pool',
        getStringMetadata
      )({ items: resource.metadata.all })
    } as any // svelte-check complains otherwise
  }
})

export const isPoolUnit = (resource: FungibleResource) =>
  getStringMetadata('pool')({ items: resource.metadata.all }) !== ''

export const getPoolUnits = (resources: FungibleResource[]) =>
  resources.filter(isPoolUnit).map(resourceToPoolUnit)
