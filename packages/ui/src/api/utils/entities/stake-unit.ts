import { andThen, otherwise, pipe } from 'ramda'
import type { _Entity } from '.'
import { getStandardMetadataEntry, getStringMetadata } from '../metadata'
import type { FungibleResource } from './resource'
import { getSingleEntityDetails } from '@api/gateway'

export type StakeUnit = Omit<FungibleResource, 'type'> &
  _Entity<
    'stakeUnit',
    [
      ['name', string],
      ['description', string],
      ['icon_url', string],
      ['validator', string]
    ]
  >

export const resourceToStakeUnit = (resource: FungibleResource): StakeUnit => ({
  ...resource,
  type: 'stakeUnit',
  metadata: {
    ...resource.metadata,
    standard: {
      ...resource.metadata.standard,
      name: getStandardMetadataEntry(
        'name',
        getStringMetadata
      )({ items: resource.metadata.all }),
      description: getStandardMetadataEntry(
        'description',
        getStringMetadata
      )({ items: resource.metadata.all }),
      icon_url: getStandardMetadataEntry(
        'icon_url',
        getStringMetadata
      )({ items: resource.metadata.all }),
      validator: getStandardMetadataEntry(
        'validator',
        getStringMetadata
      )({ items: resource.metadata.all })
    }
  } as any // svelte-check complains otherwise
})

export const isStakeUnit = pipe(
  getSingleEntityDetails,
  andThen((entity) => getStringMetadata('validator')(entity.metadata)),
  andThen(getSingleEntityDetails),
  andThen((entity) => !!getStringMetadata('pool_unit')(entity.metadata)),
  otherwise(() => false)
)
