import { createSystemMetadata, getStringMetadata } from '@api/utils/metadata'
import type { Resource, standardMetadata } from '..'
import type { StateEntityDetailsVaultResponseItem } from '@common/gateway-sdk'
import { callApi } from '@api/gateway'
import { ok } from 'neverthrow'
import { getValidatorMetadataValue } from '../../component/validator'

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
