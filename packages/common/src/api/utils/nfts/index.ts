import type {
  ProgrammaticScryptoSborValue,
  StateNonFungibleDetailsResponseItem
} from '@common/utils/gateway-sdk'
import type { GeneralNft } from './general-nft'
import { systemNftData as claimNftSystemData, type ClaimNft } from './claim-nft'
import {
  transformNftData,
  type ExpectedNftData,
  type NarrowedNftDataTypedValue,
  createStandardNftData
} from '../nft-data'
import type { NonFungibleResource } from '../entities/resource/non-fungible'
import {
  systemNftData as ownerBadgeSystemData,
  type PackageOwnerBadge
} from './package-owner-badge'

const standardNftData = createStandardNftData({
  name: 'String',
  description: 'String',
  key_image_url: 'String'
})

export type _NonFungible<
  Type extends string,
  _ExpectedNftData extends ExpectedNftData
> = {
  type: Type
  address: NonFungibleAddress
  id: string
  nftData: {
    expected: {
      [K in keyof _ExpectedNftData]: NarrowedNftDataTypedValue<
        _ExpectedNftData[K]
      >
    }
    nonStandard: ProgrammaticScryptoSborValue[]
    all: ProgrammaticScryptoSborValue[]
  }
}

export type NonFungible = GeneralNft | ClaimNft | PackageOwnerBadge

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
    typeof resource === 'string'
      ? 'generalNft'
      : resource.nonFungibleType === 'claim-nft-collection'
      ? 'claimNft'
      : resource.nonFungibleType === 'package-owner-badge-collection'
      ? 'packageOwnerBadge'
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
        nftData: transformNftData(data, standardNftData)
      } as GeneralNft)
    : type === 'claimNft'
    ? ({
        ...partial,
        nftData: transformNftData(data, {}, claimNftSystemData)
      } as ClaimNft)
    : ({
        ...partial,
        nftData: transformNftData(data, {}, ownerBadgeSystemData)
      } as PackageOwnerBadge)
}
