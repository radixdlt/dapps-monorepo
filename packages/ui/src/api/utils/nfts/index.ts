import type { StateNonFungibleDetailsResponseItem } from '@common/gateway-sdk'
import type { GeneralNft } from './general-nft'
import type { ClaimNft } from './claim-nft'
import {
  transformNftData,
  type NftDataItem,
  type KnownStandardTypes
} from '../nft-data'
import type { NonFungibleResource } from '../entities/resource/non-fungible'

export type _NonFungible<
  Type extends string,
  StandardNftData extends (keyof KnownStandardTypes)[]
> = {
  type: Type
  address: NonFungibleAddress
  id: string
  nftData: {
    standard: Partial<{ [K in StandardNftData[number]]: NftDataItem<K> }>
    nonStandard: NftDataItem[]
    all: NftDataItem[]
  }
}

export type NonFungible = GeneralNft | ClaimNft

export type NonFungibleAddress<
  R extends string = string,
  I extends string = string
> = {
  resourceAddress: R
  id: I
  nonFungibleAddress: `${R}:${I}`
}

export const transformNft = (
  resource: string | NonFungibleResource,
  { non_fungible_id, data }: StateNonFungibleDetailsResponseItem
): NonFungible => {
  const type =
    typeof resource !== 'string' &&
    resource.nonFungibleType === 'claim-nft-collection'
      ? 'claimNft'
      : 'generalNft'

  const resourceAddress =
    typeof resource === 'string' ? resource : resource.address

  const partial = {
    type,
    address: {
      resourceAddress,
      id: non_fungible_id,
      nonFungibleAddress: `${resourceAddress}:${non_fungible_id}`
    },
    id: non_fungible_id
  }

  return type === 'generalNft'
    ? ({
        ...partial,
        nftData: transformNftData(data, [
          'name',
          'description',
          'key_image_url'
        ])
      } as GeneralNft)
    : ({
        ...partial,
        nftData: transformNftData(data, ['name', 'claim_amount', 'claim_epoch'])
      } as ClaimNft)
}
