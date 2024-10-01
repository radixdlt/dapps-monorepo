import { createSystemMetadata, getStringMetadata } from '@api/utils/metadata'
import type { Resource, standardMetadata } from '..'
import type { StateEntityDetailsVaultResponseItem } from '@common/gateway-sdk'
import { callApi } from '@api/gateway'

import type { DefaultNonFungibleResource } from '.'
import { transformMetadata } from '@api/utils/metadata'

export const systemMetadata = createSystemMetadata({
  name: 'String',
  description: 'String',
  icon_url: 'Url',
  validator: 'GlobalAddress'
})

export type ClaimNftCollection = Resource<
  'non-fungible',
  typeof standardMetadata & typeof systemMetadata
> & {
  nonFungibleType: 'claim-nft-collection'
}

export const getClaimNftMetadataValue = (
  entity: StateEntityDetailsVaultResponseItem
) => getStringMetadata('claim_nft')(entity.metadata)

export const isClaimNftCollection = (
  resourceEntity: StateEntityDetailsVaultResponseItem
) => {
  return (
    resourceEntity.details?.type === 'NonFungibleResource' &&
    resourceEntity.details.native_resource_details?.kind === 'ValidatorClaimNft'
  )
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

export const verifyClaimNft = (entity: StateEntityDetailsVaultResponseItem) =>
  entity.details?.type === 'NonFungibleResource' &&
  entity.details.native_resource_details?.kind === 'ValidatorClaimNft'
