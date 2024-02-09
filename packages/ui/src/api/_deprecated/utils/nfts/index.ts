import type {
  NonFungibleResourcesCollectionItemVaultAggregated,
  StateNonFungibleDetailsResponseItem
} from '@common/gateway-sdk'
import type { GeneralNft } from './general-nft'
import { isUnstakeData, type ClaimNft } from './claim-nft'
import {
  transformNftData,
  type NftDataItem,
  type KnownStandardTypes
} from '../nft-data'

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
  resource_address: NonFungibleResourcesCollectionItemVaultAggregated['resource_address'],
  responseItem: StateNonFungibleDetailsResponseItem | undefined
): NonFungible => {
  if (responseItem === undefined) {
    return {} as NonFungible
  }

  const { non_fungible_id, data } = responseItem
  const type = isUnstakeData(data) ? 'claimNft' : 'generalNft'

  const partial = {
    type,
    address: {
      resourceAddress: resource_address,
      id: non_fungible_id,
      nonFungibleAddress: `${resource_address}:${non_fungible_id}`
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
