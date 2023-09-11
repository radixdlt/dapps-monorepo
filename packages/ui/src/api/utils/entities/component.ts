import BigNumber from 'bignumber.js'
import type { _Entity } from '.'
import type {
  StateEntityDetailsResponseComponentDetails,
  StateEntityDetailsVaultResponseItem
} from '@radixdlt/babylon-gateway-api-sdk'
import {
  getStandardMetadataEntry,
  getStringMetadata,
  getVectorMetadata
} from '../metadata'

export type Component = _Entity<
  'component',
  [['name', string], ['description', string]]
> & {
  packageAddress: string
  blueprintName: string
  royalty: BigNumber
}

export const transformComponent = (
  entity: StateEntityDetailsVaultResponseItem
): Component => ({
  type: 'component',
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
  },
  packageAddress:
    (entity.details as StateEntityDetailsResponseComponentDetails)!
      .package_address!,
  blueprintName: (entity.details as StateEntityDetailsResponseComponentDetails)!
    .blueprint_name!,
  royalty: new BigNumber(0)
})
