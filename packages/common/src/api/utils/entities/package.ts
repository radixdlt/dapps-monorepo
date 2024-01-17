import type {
  StateEntityDetailsResponsePackageDetails,
  StateEntityDetailsVaultResponseItem
} from '@common/utils/gateway-sdk'
import { transformEntity, type _Entity } from '.'
import { pipe } from 'ramda'
import { createStandardMetadata } from '../metadata'

const standardMetadata = createStandardMetadata({
  name: 'String',
  description: 'String',
  tags: 'StringArray'
})

export type Package = _Entity<'package', typeof standardMetadata>

export let transformPackage: (
  entity: StateEntityDetailsVaultResponseItem
) => Package = pipe(
  transformEntity<
    StateEntityDetailsResponsePackageDetails,
    typeof standardMetadata,
    never
  >(standardMetadata),
  (entity) => ({
    ...entity,
    type: 'package' as const
  })
)
