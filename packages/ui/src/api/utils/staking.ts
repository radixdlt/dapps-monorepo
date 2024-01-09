import type { ValidatorListItem } from './entities/component/validator'
import BigNumber from 'bignumber.js'
import { RET_DECIMAL_PRECISION } from '@constants'
import type { ClaimNft } from './nfts/claim-nft'
import type { Account } from './entities/component/account'
import type { NonFungible } from './nfts'
import type { FungibleResource } from './entities/resource/fungible'
import { isNil } from 'ramda'

type CommonStakeInfo<T extends string> = {
  type: T
  account: string
  validator: ValidatorListItem
  xrdAmount: string
}

export type StakedInfo = CommonStakeInfo<'staked'> & {
  stakeUnitsAmount: string
}

export type UnstakingInfo = CommonStakeInfo<'unstaking'> & {
  claimEpoch: string
}

export type ReadyToClaimInfo = CommonStakeInfo<'readyToClaim'> & {
  claimEpoch: string
  claimNft: ClaimNft
}

export type StakeInfo = StakedInfo | UnstakingInfo | ReadyToClaimInfo

export const getUnstakeAndClaimInfo =
  (validators: ValidatorListItem[]) =>
  (nfts: NonFungible[]) =>
  (account: Account, currentEpoch: number) => {
    const claimNfts = account.resources.nonFungible
      .map((resource) =>
        nfts.find((nft) => nft.address.resourceAddress === resource.address)
      )
      .filter((nft): nft is NonNullable<typeof nft> => !isNil(nft))
      .flat()
      .filter((nft): nft is ClaimNft => nft.type === 'claimNft')

    let unstaking: UnstakingInfo[] = []
    let readyToClaim: ReadyToClaimInfo[] = []

    for (const claimNft of claimNfts) {
      const isClaimable = new BigNumber(
        claimNft.nftData.expected['claim_epoch']!.value
      ).lte(currentEpoch)

      const validator = validators.find(
        (validator) =>
          validator.unstakeClaimResourceAddress ===
          claimNft.address.resourceAddress
      )!

      const xrdAmount = new BigNumber(
        claimNft.nftData.expected['claim_amount']!.value
      ).toFixed(RET_DECIMAL_PRECISION)

      if (new BigNumber(xrdAmount).eq(0)) continue

      const unstakeInfo = {
        account: account.address,
        validator,
        xrdAmount,
        claimNft,
        claimEpoch: claimNft.nftData.expected['claim_epoch']!.value
      }

      isClaimable
        ? readyToClaim.push({
            ...unstakeInfo,
            type: 'readyToClaim'
          })
        : unstaking.push({
            ...unstakeInfo,
            type: 'unstaking'
          })
    }

    return {
      unstaking,
      readyToClaim
    }
  }

export const getStakedInfo =
  (validators: ValidatorListItem[], fungibles: FungibleResource[]) =>
  (account: Account) =>
    account.resources.fungible
      .filter((token) =>
        validators.some(
          (validator) => validator.stakeUnitResourceAddress === token.address
        )
      )
      .map((stakeUnitToken) => {
        const validator = validators.find(
          (validator) =>
            validator.stakeUnitResourceAddress === stakeUnitToken.address
        )!

        const xrdAmount = validator.totalStakeInXRD
          .multipliedBy(stakeUnitToken.value)
          .dividedBy(
            fungibles.find((token) => token.address === stakeUnitToken.address)!
              .totalSupply
          )
          .toFixed(RET_DECIMAL_PRECISION)

        return {
          type: 'staked',
          account: account.address,
          validator,
          stakeUnitsAmount: stakeUnitToken.value,
          xrdAmount
        } as StakedInfo
      })
      .filter((stakeInfo) => !new BigNumber(stakeInfo.xrdAmount).eq(0))
