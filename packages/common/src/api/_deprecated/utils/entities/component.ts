import BigNumber from 'bignumber.js'
import { transformEntity, type _Entity } from '.'
import type {
  StateEntityDetailsResponseComponentDetails,
  StateEntityDetailsVaultResponseItem
} from '@common/utils/gateway-sdk'
import { pipe } from 'ramda'

export type Component = _Entity<'component', ['name', 'description']> & {
  packageAddress: string
  blueprintName: string
  royalty: BigNumber
}

export const transformComponent: (
  entity: StateEntityDetailsVaultResponseItem
) => Component = pipe(
  transformEntity(['name', 'description', 'tags']),
  (entity) => ({
    ...entity,
    type: 'component' as const,
    packageAddress: (entity.entity
      .details as StateEntityDetailsResponseComponentDetails)!.package_address!,
    blueprintName: (entity.entity
      .details as StateEntityDetailsResponseComponentDetails)!.blueprint_name!,
    royalty: new BigNumber(0)
  })
)
