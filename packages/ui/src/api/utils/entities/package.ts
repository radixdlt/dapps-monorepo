import type { StateEntityDetailsVaultResponseItem } from '@radixdlt/babylon-gateway-api-sdk'
import type { _Entity } from '.'
import {
  getStandardMetadataEntry,
  getStringMetadata,
  getVectorMetadata
} from '../metadata'

export type Package = _Entity<
  [['name', string], ['description', string], ['tags', string[]]]
>

export let transformPackage = (
  entity: StateEntityDetailsVaultResponseItem
): Package => ({
  address: entity.address,
  metadata: {
    standard: {
      name: getStandardMetadataEntry(
        'name',
        getStringMetadata
      )(entity.metadata),
      description: getStandardMetadataEntry(
        'description',
        getStringMetadata
      )(entity.metadata),
      tags: getStandardMetadataEntry('tags', getVectorMetadata)(entity.metadata)
    },
    nonStandard: (entity.metadata?.items || []).filter(
      ({ key }) => key !== 'name' && key !== 'tags' && key !== 'description'
    ),
    explicit: entity.explicit_metadata?.items ?? [],
    all: entity.metadata?.items ?? []
  }
})
