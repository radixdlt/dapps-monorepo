import { createSystemMetadata } from '@api/utils/metadata'
import type { Resource, standardMetadata } from '..'
import type { StateEntityDetailsVaultResponseItem } from '@common/gateway-sdk'

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

export const isClaimNft = (
  resourceEntity: StateEntityDetailsVaultResponseItem
) =>
  resourceEntity.details?.type === 'NonFungibleResource' &&
  resourceEntity.details.native_resource_details?.kind === 'ValidatorClaimNft'

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
