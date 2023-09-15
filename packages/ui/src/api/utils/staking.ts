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
  stakeUnitsAmount: string
}

export type StakedInfo = CommonStakeInfo<'staked'>
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
    const unstakeTokens = accountData.nonFungible
      .filter(({ resource }) =>
        validators.some(
          (validator) =>
            validator.unstakeClaimResourceAddress === resource.address
        )
      )
      .map(({ nonFungibles }) => nonFungibles as ClaimNft[])
      .flat()

    let unstaking: UnstakingInfo[] = []
    let readyToClaim: ReadyToClaimInfo[] = []

    for (const token of unstakeTokens) {
      const isClaimable = new BigNumber(
        token.nftData.standard['claim_epoch']!.value
      ).lte(currentEpoch)

      const validator = validators.find(
        (validator) =>
          validator.unstakeClaimResourceAddress ===
          token.address.resourceAddress
      )!

      const xrdAmount = new BigNumber(
        token.nftData.standard['claim_amount']!.value
      ).toFixed(RET_DECIMAL_PRECISION - 1)

      if (new BigNumber(xrdAmount).eq(0)) continue

      const stakeUnitsAmount = accountData.fungible.find(
        (token) => token.address === validator.stakeUnitResourceAddress
      )!.value

      const stakeInfo = {
        account: accountData.accountAddress,
        validator,
        xrdAmount,
        claimEpoch: token.nftData.standard['claim_epoch']!.value,
        stakeUnitsAmount
      }

      isClaimable
        ? readyToClaim.push({
            ...stakeInfo,
            type: 'readyToClaim'
          })
        : unstaking.push({
            ...stakeInfo,
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

        const xrdAmount = new BigNumber(validator.totalStakeInXRD)
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
