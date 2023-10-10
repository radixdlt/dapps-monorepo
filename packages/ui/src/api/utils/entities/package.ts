import type { StateEntityDetailsVaultResponseItem } from '@common/gateway-sdk'
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
