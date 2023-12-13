import { transformResource, type Resource, type StandardMetadata } from '..'
import { pipe } from 'ramda'
import type { StateEntityDetailsVaultResponseItem } from '@common/gateway-sdk'
import { getStringMetadata } from '@api/_deprecated/utils/metadata'
import type { Validator, ValidatorListItem } from '../../component/validator'
import type {
  ClaimNftCollection,
  SystemMetadata as ClaimSystemMetadata
} from './claim-nft-collection'

export type DefaultNonFungibleResource = Resource<
  'non-fungible',
  StandardMetadata
> & {
  nonFungibleType: 'default'
}

export type NonFungibleResource =
  | DefaultNonFungibleResource
  | ClaimNftCollection

const isClaimNftCollection = (
  resourceEntity: StateEntityDetailsVaultResponseItem,
  validators: (ValidatorListItem | Validator)[]
) => {
  const validator = validators.find(
    (validator) =>
      validator.address ===
        getStringMetadata('validator')(resourceEntity.metadata) &&
      validator.unstakeClaimResourceAddress === resourceEntity.address
  )

  return validator !== undefined
}

export const transformNonFungibleResource = (
  entity: StateEntityDetailsVaultResponseItem,
  validators?: (ValidatorListItem | Validator)[]
): NonFungibleResource => {
  if (validators && isClaimNftCollection(entity, validators)) {
    return {
      ...transformResource<ClaimSystemMetadata>(entity),
      resourceType: 'non-fungible',
      nonFungibleType: 'claim-nft-collection'
    } as const
  }
  return {
    ...transformResource<StandardMetadata>(entity),
    resourceType: 'non-fungible',
    nonFungibleType: 'default'
  } as const
}
