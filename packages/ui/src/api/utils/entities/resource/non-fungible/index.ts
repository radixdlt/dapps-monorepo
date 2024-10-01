import { transformResource, type Resource } from '..'
import type { StateEntityDetailsVaultResponseItem } from '@common/gateway-sdk'
import {
  systemMetadata as claimNftSystemMetadata,
  type ClaimNftCollection,
  isClaimNft
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

export const transformNonFungibleResource = (
  entity: StateEntityDetailsVaultResponseItem
): NonFungibleResource => {
  if (entity.details?.type !== 'NonFungibleResource') {
    throw new Error('Invalid resource type')
  }

  if (isClaimNft(entity)) {
    return {
      ...transformResource(entity, claimNftSystemMetadata),
      resourceType: 'non-fungible',
      nativeResourceDetails: entity.details.native_resource_details,
      nonFungibleType: 'claim-nft-collection'
    } as const
  }

  if (isPackageOwnerBadgeCollection(entity)) {
    return {
      ...transformResource(entity, PackageOwnerSystemMetadata),
      resourceType: 'non-fungible',
      nativeResourceDetails: entity.details.native_resource_details,
      nonFungibleType: 'package-owner-badge-collection'
    } as const
  }

  return {
    ...transformResource(entity),
    resourceType: 'non-fungible',
    nativeResourceDetails: entity.details.native_resource_details,
    nonFungibleType: 'default'
  } as const
}
