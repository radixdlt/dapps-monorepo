import type { ValidatorListItem } from './entities/component/validator'
import BigNumber from 'bignumber.js'
import { RET_DECIMAL_PRECISION } from '@constants'
import type { ClaimNft } from './nfts/claim-nft'
import type { Account } from './entities/component/account'
import type { NonFungible } from './nfts'
import type { FungibleResource } from './entities/resource/fungible'
import type { Component } from './entities/component'
import type { standardMetadata } from './metadata'
import type { NativeResourceValidatorLiquidStakeUnitValue } from '@common/gateway-sdk'

type CommonStakeInfo<T extends string> = {
  type: T
  account: string
  validatorAddress: string
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

export const getUnstakeAndClaimInfoV2 =
  (nfts: NonFungible[]) =>
  (
    account: Account | Component<unknown, typeof standardMetadata>,
    currentEpoch: number
  ) => {
    const claimNfts = nfts.filter(
      (nft): nft is ClaimNft => nft.type === 'claimNft'
    )

    let unstaking: UnstakingInfo[] = []
    let readyToClaim: ReadyToClaimInfo[] = []

    for (const claimNft of claimNfts) {
      const isClaimable = new BigNumber(
        claimNft.nftData.expected['claim_epoch']!.value
      ).lte(currentEpoch)

      const xrdAmount = new BigNumber(
        claimNft.nftData.expected['claim_amount']!.value
      ).toFixed(RET_DECIMAL_PRECISION)

      if (new BigNumber(xrdAmount).eq(0)) continue

      const unstakeInfo = {
        account: account.address,
        validatorAddress: claimNft.validatorAddress,
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
  (fungibles: FungibleResource[]) =>
  (account: Account | Component<unknown, typeof standardMetadata>) => {
    const stakeUnits: Map<string, NativeResourceValidatorLiquidStakeUnitValue> =
      new Map(
        fungibles
          .filter(
            (token) =>
              token.nativeResourceDetails &&
              token.nativeResourceDetails.kind === 'ValidatorLiquidStakeUnit'
          )
          .map((token) => {
            return [
              token.address,
              token.nativeResourceDetails as NativeResourceValidatorLiquidStakeUnitValue
            ]
          })
      )

    return account.resources.fungible
      .filter((token) => stakeUnits.has(token.address))
      .map((stakeUnitToken) => {
        const stakeUnitNativeResourceDetails = stakeUnits.get(
          stakeUnitToken.address
        )!
        const multiplier =
          stakeUnitNativeResourceDetails.unit_redemption_value[0].amount || '1'

        const xrdAmount = new BigNumber(stakeUnitToken.value)
          .multipliedBy(new BigNumber(multiplier!))
          .toFixed(RET_DECIMAL_PRECISION)

        return {
          type: 'staked',
          account: account.address,
          validatorAddress: stakeUnitNativeResourceDetails.validator_address,
          stakeUnitsAmount: stakeUnitToken.value,
          xrdAmount
        } as StakedInfo
      })
      .filter((stakeInfo) => !new BigNumber(stakeInfo.xrdAmount).eq(0))
  }
