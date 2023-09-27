import type { Validator } from './entities/validator'
import type { getAccountData } from './entities/resource'
import BigNumber from 'bignumber.js'
import { RET_DECIMAL_PRECISION } from '@constants'
import type { ClaimNft } from './nfts/claim-nft'

type CommonStakeInfo<T extends string> = {
  type: T
  account: string
  validator: Validator
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
}

export type StakeInfo = StakedInfo | UnstakingInfo | ReadyToClaimInfo

export const getUnstakeAndClaimInfo =
  (validators: Validator[]) =>
  (
    accountData: Awaited<ReturnType<typeof getAccountData>>[number],
    currentEpoch: number
  ) => {
    const claimNfts = accountData.nonFungible
      .map((resource) => resource.nonFungibles)
      .flat()
      .filter(
        (nft): nft is ClaimNft =>
          typeof nft !== 'string' && nft.type === 'claimNft'
      )

    let unstaking: UnstakingInfo[] = []
    let readyToClaim: ReadyToClaimInfo[] = []

    for (const claimNft of claimNfts) {
      const isClaimable = new BigNumber(
        claimNft.nftData.standard['claim_epoch']!.value
      ).lte(currentEpoch)

      const validator = validators.find(
        (validator) =>
          validator.unstakeClaimResourceAddress ===
          claimNft.address.resourceAddress
      )!

      const xrdAmount = new BigNumber(
        claimNft.nftData.standard['claim_amount']!.value
      ).toFixed(RET_DECIMAL_PRECISION - 1)

      if (new BigNumber(xrdAmount).eq(0)) continue

      const unstakeInfo = {
        account: accountData.accountAddress,
        validator,
        xrdAmount,
        claimEpoch: claimNft.nftData.standard['claim_epoch']!.value
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
  (validators: Validator[]) =>
  (accountData: Awaited<ReturnType<typeof getAccountData>>[number]) =>
    accountData.fungible
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
          .dividedBy(stakeUnitToken.totalSupply)
          .toFixed(RET_DECIMAL_PRECISION - 1)

        return {
          type: 'staked',
          account: accountData.accountAddress,
          validator,
          stakeUnitsAmount: stakeUnitToken.value,
          xrdAmount
        } as StakedInfo
      })
      .filter((stakeInfo) => !new BigNumber(stakeInfo.xrdAmount).eq(0))
