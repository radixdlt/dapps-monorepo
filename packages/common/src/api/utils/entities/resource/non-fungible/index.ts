import { transformResource, type Resource } from '..'
import type { StateEntityDetailsVaultResponseItem } from '@common/utils/gateway-sdk'
import type { Validator, ValidatorListItem } from '../../component/validator'
import {
  systemMetadata as claimNftSystemMetadata,
  type ClaimNftCollection,
  isClaimNftCollection
} from './claim-nft-collection'
import {
  isPackageOwnerBadgeCollection,
  type PackageOwnerBadgeCollection,
  systemMetadata as PackageOwnerSystemMetadata
} from './package-owner-badge-collection'

export type DefaultNonFungibleResource = Resource<'non-fungible'> & {
  nonFungibleType: 'default'
}

export type NonFungibleResource =
  | DefaultNonFungibleResource
  | ClaimNftCollection
  | PackageOwnerBadgeCollection

export const transformNonFungibleResource = async (
  entity: StateEntityDetailsVaultResponseItem,
  validators?: (ValidatorListItem | Validator)[]
): Promise<NonFungibleResource> => {
  if (validators && isClaimNftCollection(entity, validators)) {
    return {
      ...transformResource(entity, claimNftSystemMetadata),
      resourceType: 'non-fungible',
      nonFungibleType: 'claim-nft-collection'
    } as const
  }

  if (await isPackageOwnerBadgeCollection(entity.address)) {
    return {
      ...transformResource(entity, PackageOwnerSystemMetadata),
      resourceType: 'non-fungible',
      nonFungibleType: 'package-owner-badge-collection'
    } as const
  }

  return {
    ...transformResource(entity),
    resourceType: 'non-fungible',
    nonFungibleType: 'default'
  } as const
}
