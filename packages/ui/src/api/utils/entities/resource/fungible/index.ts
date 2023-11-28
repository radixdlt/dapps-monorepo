import { transformResource, type Resource, type StandardMetadata } from '..'
import { pipe } from 'ramda'
import type {
  StateEntityDetailsResponseFungibleResourceDetails,
  StateEntityDetailsVaultResponseItem
} from '@common/gateway-sdk'

export type FungibleResource = Resource<'fungible', StandardMetadata> & {
  divisibility: number
}

export const transformFungibleResource = (
  entity: StateEntityDetailsVaultResponseItem
): FungibleResource =>
  pipe(
    () => transformResource<StandardMetadata>(entity),
    (entity) =>
      ({
        ...entity,
        resourceType: 'fungible',
        divisibility: (
          entity.details as StateEntityDetailsResponseFungibleResourceDetails
        ).divisibility
      } as const)
  )()
