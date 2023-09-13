import type { StateEntityDetailsVaultResponseItem } from '@radixdlt/babylon-gateway-api-sdk'
import type { _Entity } from '.'
import {
  getStandardMetadataEntry,
  getStringMetadata,
  getVectorMetadata
} from '../metadata'
import { getEntityDetails } from '@api/gateway'
import { map } from 'ramda'
import { transformFungibleResource } from './resource'

export type Pool = _Entity<
  'pool',
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
  type: 'pool',
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

export const getPoolTokens = async (pool: Pool) => {
  if (!pool.metadata.standard.pool_unit) return

  const poolResources = await getEntityDetails(
    pool.metadata.standard.pool_resources?.value || []
  ).then(map(transformFungibleResource))

  return poolResources
}
