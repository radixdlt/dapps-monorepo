import type {
  StateEntityDetailsResponsePackageDetails,
  StateEntityDetailsVaultResponseItem
} from '@common/gateway-sdk'
import { transformEntity, type _Entity } from '.'
import { pipe } from 'ramda'
import type { MetadataTypeToNativeType } from '../metadata'

type StandardMetadata = {
  name: MetadataTypeToNativeType['String']
  description: MetadataTypeToNativeType['String']
  tags: MetadataTypeToNativeType['StringArray']
}

export type Package = _Entity<'package', StandardMetadata>

export let transformPackage: (
  entity: StateEntityDetailsVaultResponseItem
) => Package = pipe(
  transformEntity<StateEntityDetailsResponsePackageDetails, StandardMetadata>([
    'name',
    'description',
    'tags'
  ]),
  (entity) => ({
    ...entity,
    type: 'package' as const
  })
)
