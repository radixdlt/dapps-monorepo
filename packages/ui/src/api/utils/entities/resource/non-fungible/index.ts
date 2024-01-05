import { transformResource, type Resource } from '..'
import type { StateEntityDetailsVaultResponseItem } from '@common/gateway-sdk'
import { getStringMetadata } from '@api/utils/metadata'
import type { Validator, ValidatorListItem } from '../../component/validator'
import { systemMetadata, type ClaimNftCollection } from './claim-nft-collection'
import { transformMetadata } from '@api/utils/metadata'

export type DefaultNonFungibleResource = Resource<'non-fungible'> & {
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

export const resourceToClaimNftCollection = (
  resource: DefaultNonFungibleResource
): ClaimNftCollection => ({
  ...resource,
  type: 'resource',
  nonFungibleType: 'claim-nft-collection',
  metadata: {
    ...resource.metadata,
    expected: {
      ...resource.metadata.expected,
      ...transformMetadata(
        {
          metadata: {
            items: resource.metadata.all
          }
        },
        systemMetadata
      ).expected
    }
  }
})

export const transformNonFungibleResource = (
  entity: StateEntityDetailsVaultResponseItem,
  validators?: (ValidatorListItem | Validator)[]
): NonFungibleResource => {
  if (validators && isClaimNftCollection(entity, validators)) {
    return {
      ...transformResource(entity, systemMetadata),
      resourceType: 'non-fungible',
      nonFungibleType: 'claim-nft-collection'
    } as const
  }
  return {
    ...transformResource(entity),
    resourceType: 'non-fungible',
    nonFungibleType: 'default'
  } as const
}
