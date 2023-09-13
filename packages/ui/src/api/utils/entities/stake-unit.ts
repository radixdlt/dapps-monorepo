import { andThen, otherwise, pipe } from 'ramda'
import type { _Entity } from '.'
import {
  getMetadataItem,
  getStringMetadataValue,
  transformMetadata
} from '../metadata'
import type { FungibleResource } from './resource'
import { getSingleEntityDetails } from '@api/gateway'

export type StakeUnit = Omit<FungibleResource, 'type'> &
  _Entity<'stakeUnit', ['name', 'description', 'icon_url', 'validator']>

export const resourceToStakeUnit = (resource: FungibleResource): StakeUnit => ({
  ...resource,
  type: 'stakeUnit',
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
        ['name', 'description', 'icon_url', 'validator']
      ).standard
    }
  } as any // svelte-check complains otherwise
})

export const isStakeUnit = pipe(
  getSingleEntityDetails,
  andThen(
    pipe(
      (entity) => getMetadataItem('validator')(entity.metadata)!,
      getStringMetadataValue
    )
  ),
  andThen(getSingleEntityDetails),
  andThen(
    pipe(
      (entity) => getMetadataItem('pool_unit')(entity.metadata)!,
      getStringMetadataValue
    )
  ),
  andThen((result) => !!result),
  otherwise(() => false)
)
