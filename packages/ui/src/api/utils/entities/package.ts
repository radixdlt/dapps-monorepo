import type { StateEntityDetailsVaultResponseItem } from '@common/gateway-sdk'
import { transformEntity, type _Entity } from '.'
import { pipe } from 'ramda'

export type Package = _Entity<'package', ['name', 'description'], false>

export let transformPackage: (
  entity: StateEntityDetailsVaultResponseItem
) => Package = pipe(
  transformEntity(['name', 'description', 'tags']),
  (entity) => ({
    ...entity,
    type: 'package' as const
  })
)
