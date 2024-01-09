import { createSystemMetadata, getStringMetadata } from '@api/utils/metadata'
import type { Resource, standardMetadata } from '..'
import type { StateEntityDetailsVaultResponseItem } from '@common/gateway-sdk'
import { callApi } from '@api/gateway'
import { ok } from 'neverthrow'
import {
  getValidatorMetadataValue,
  type Validator,
  type ValidatorListItem
} from '../../component/validator'
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

const getEntityDetails = (address: string) =>
  callApi('getEntityDetailsVaultAggregated', [address])

export const isClaimNftCollection = (
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

export const verifyClaimNft = async (
  entity: StateEntityDetailsVaultResponseItem
) => {
  const result = await ok(getValidatorMetadataValue(entity))
    .asyncAndThen(getEntityDetails)
    .map(([entity]) => getClaimNftMetadataValue(entity))
    .map((claimNft) => claimNft === entity.address)

  return result.isOk() && result.value === true
}
