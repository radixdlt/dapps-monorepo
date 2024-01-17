import { transformResource, type Resource, standardMetadata } from '..'
import { pipe } from 'ramda'
import type {
  StateEntityDetailsResponseFungibleResourceDetails,
  StateEntityDetailsVaultResponseItem
} from '@common/utils/gateway-sdk'

export type FungibleResource = Resource<'fungible', typeof standardMetadata> & {
  divisibility: number
}

export const transformFungibleResource = (
  entity: StateEntityDetailsVaultResponseItem
): FungibleResource =>
  pipe(
    () => transformResource<typeof standardMetadata>(entity),
    (entity) =>
      ({
        ...entity,
        resourceType: 'fungible',
        divisibility: (
          entity.details as StateEntityDetailsResponseFungibleResourceDetails
        ).divisibility
      } as const)
  )()
