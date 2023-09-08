import type { StateEntityDetailsVaultResponseItem } from '@radixdlt/babylon-gateway-api-sdk'
import type { _Entity } from '.'
import {
  getStandardMetadataEntry,
  getStringMetadata,
  getVectorMetadata
} from '../metadata'

export type Pool = _Entity<
  [
    ['owner_badge', string],
    ['pool_vault_number', string],
    ['pool_resources', string[]],
    ['pool_unit', string]
  ]
>

export const transformPool = (
  entity: StateEntityDetailsVaultResponseItem
): Pool => ({
  address: entity.address,
  metadata: {
    standard: {
      owner_badge: getStandardMetadataEntry(
        'owner_badge',
        getStringMetadata
      )(entity.metadata),
      pool_vault_number: getStandardMetadataEntry(
        'pool_vault_number',
        getStringMetadata
      )(entity.metadata),
      pool_resources: getStandardMetadataEntry(
        'pool_resources',
        getVectorMetadata
      )(entity.metadata),
      pool_unit: getStandardMetadataEntry(
        'pool_unit',
        getStringMetadata
      )(entity.metadata)
    },
    nonStandard: entity.metadata.items.filter(
      (item) =>
        ![
          'owner_badge',
          'pool_vault_number',
          'pool_resources',
          'pool_unit'
        ].includes(item.key)
    ),
    explicit: [],
    all: entity.metadata.items
  }
})
