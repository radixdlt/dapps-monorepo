import {
  getStringMetadata,
  type MetadataTypeToNativeType
} from '@api/utils/metadata'
import type { Resource } from '..'
import type { StateEntityDetailsVaultResponseItem } from '@common/gateway-sdk'
import { callApi } from '@api/gateway'
import { ok } from 'neverthrow'
import { getValidatorMetadataValue } from '../../component/validator'

export type SystemMetadata = {
  name: MetadataTypeToNativeType['String']
  description: MetadataTypeToNativeType['String']
  icon_url: MetadataTypeToNativeType['Url']
  validator: MetadataTypeToNativeType['String']
}

export type ClaimNftCollection = Resource<'non-fungible', SystemMetadata> & {
  nonFungibleType: 'claim-nft-collection'
}

export const getClaimNftMetadataValue = (
  entity: StateEntityDetailsVaultResponseItem
) => getStringMetadata('claim_nft')(entity.metadata)

const getEntityDetails = (address: string) =>
  callApi('getEntityDetailsVaultAggregated', [address])

export const verifyClaimNft = async (
  entity: StateEntityDetailsVaultResponseItem
) => {
  const result = await ok(getValidatorMetadataValue(entity))
    .asyncAndThen(getEntityDetails)
    .map(([entity]) => getClaimNftMetadataValue(entity))
    .map((claimNft) => claimNft === entity.address)

  return result.isOk() && result.value === true
}
