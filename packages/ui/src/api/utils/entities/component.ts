import BigNumber from 'bignumber.js'
import type { _Entity } from '.'
import type {
  StateEntityDetailsResponseComponentDetails,
  StateEntityDetailsVaultResponseItem
} from '@radixdlt/babylon-gateway-api-sdk'
import { transformMetadata } from '../metadata'

export type Component = _Entity<'component', ['name', 'description']> & {
  packageAddress: string
  blueprintName: string
  royalty: BigNumber
}

export const transformComponent = (
  entity: StateEntityDetailsVaultResponseItem
): Component => ({
  type: 'component',
  address: entity.address,
  metadata: transformMetadata(entity, ['name', 'description', 'tags']),
  packageAddress:
    (entity.details as StateEntityDetailsResponseComponentDetails)!
      .package_address!,
  blueprintName: (entity.details as StateEntityDetailsResponseComponentDetails)!
    .blueprint_name!,
  royalty: new BigNumber(0)
})
