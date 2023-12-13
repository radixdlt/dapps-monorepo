import type { MetadataTypeToNativeType } from '@api/utils/metadata'
import type { Resource } from '..'

export type SystemMetadata = {
  name: MetadataTypeToNativeType['String']
  description: MetadataTypeToNativeType['String']
  icon_url: MetadataTypeToNativeType['Url']
  validator: MetadataTypeToNativeType['String']
}

export type ClaimNftCollection = Resource<'non-fungible', SystemMetadata> & {
  nonFungibleType: 'claim-nft-collection'
}
