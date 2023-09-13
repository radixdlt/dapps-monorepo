import type { StateEntityDetailsVaultResponseItem } from '@radixdlt/babylon-gateway-api-sdk'
import type { _Entity } from '.'
import { transformMetadata } from '../metadata'

export type Pool = _Entity<
  'pool',
  ['owner_badge', 'pool_vault_number', 'pool_resources', 'pool_unit']
>

export const transformPool = (
  entity: StateEntityDetailsVaultResponseItem
): Pool => ({
  type: 'pool',
  address: entity.address,
  metadata: transformMetadata(entity, [
    'owner_badge',
    'pool_vault_number',
    'pool_resources',
    'pool_unit',
    'tags'
  ])
})
