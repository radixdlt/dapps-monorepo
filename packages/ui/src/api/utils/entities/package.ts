import type { StateEntityDetailsVaultResponseItem } from '@radixdlt/babylon-gateway-api-sdk'
import type { _Entity } from '.'
import { transformMetadata } from '../metadata'

export type Package = _Entity<'package', ['name', 'description']>

export let transformPackage = (
  entity: StateEntityDetailsVaultResponseItem
): Package => ({
  type: 'package',
  address: entity.address,
  metadata: transformMetadata(entity, ['name', 'description', 'tags'])
})
