import type { _Entity } from '.'
import { getMetadataItem, transformMetadata } from '../metadata'
import type { FungibleResource } from './resource'

export type PoolUnit = Omit<FungibleResource, 'type'> &
  _Entity<'poolUnit', ['pool']>

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

export const isPoolUnit = (resource: FungibleResource) => {
  const poolMetadataEntry = getMetadataItem('pool')({
    items: resource.metadata.all
  })
  return (
    poolMetadataEntry?.value.typed.type === 'GlobalAddress' &&
    poolMetadataEntry?.value.typed.value.startsWith('pool_')
  )
}

export const getPoolUnits = (resources: FungibleResource[]) =>
  resources.filter(isPoolUnit).map(resourceToPoolUnit)
