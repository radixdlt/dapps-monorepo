import { bookmarkedValidatorsApi } from '../../../server/validators/validators-api'
import type { LayoutLoad } from './$types'
import {
  getEntityDetails,
  getGatewayStatus,
  getValidatorsList
} from '@api/gateway'
import { getAccountData, getEnumStringMetadata } from '@api/utils/resources'
import type { Validator } from '@dashboard-pages/navbar-pages/staking/Validators.svelte'
import { accounts, type Account } from '@stores'
import BigNumber from 'bignumber.js'
import { derived } from 'svelte/store'
import type {
  ReadyToClaimInfo,
  StakeInfo,
  StakedInfo,
  UnstakingInfo
} from './+layout.svelte'
import type { StateEntityDetailsResponseFungibleResourceDetails } from '@radixdlt/babylon-gateway-api-sdk'
import { RET_DECIMAL_PRECISION } from '@constants'
import { bookmarkedValidatorsStore } from '../../../stores'

export const prerender = false

export const _dependency = 'load:validators'

export type AccumulatedStakes = {
  [validator: string]: {
    accumulatedStakes: string
    accumulatedUnstaking: string
    accumulatedReadyToClaim: string
  }
}

export type Bookmarked = { [validator: string]: boolean }

export const load: LayoutLoad = ({ fetch, depends }) => {
  depends(_dependency)

  const validators = getValidatorsList().then(async (validators) => {
    const stakeUnitTotalSupply = await getEntityDetails(
      validators.map(
        (v) => (v.state as any).value.stake_unit_resource_address as string
      )
    )

    return validators.map((validator, i) => {
      const state: any = validator.state || {}

      const stakeUnitResourceAddress = state.value
        .stake_unit_resource_address as string

      return {
        name: getEnumStringMetadata('name')(validator.metadata),
        website: getEnumStringMetadata('url')(validator.metadata),
        address: validator.address,
        fee: (state.validator_fee_factor || 0) * 100,
        percentageTotalStake: validator.active_in_epoch?.stake_percentage || 0,
        totalStake: validator.stake_vault.balance,

        stakeUnitResourceAddress,
        unstakeClaimResourceAddress: state.value
          .unstake_claim_token_resource_address as string,

        stakeUnitsToStakedRatio: new BigNumber(
          validator.stake_vault.balance
        ).dividedBy(
          (
            stakeUnitTotalSupply[i]
              .details as StateEntityDetailsResponseFungibleResourceDetails
          ).total_supply
        ),

        // TODO:
        ownerAddress: '',
        ownerStake: '0',
        percentageOwnerStake: 0,
        apy: 0,
        uptime: 0,
        acceptsStake: true
      } as Validator
    })
  })

  const getStakedInfo =
    (validators: Validator[]) =>
    (
      account: Account,
      accountData: Awaited<ReturnType<typeof getAccountData>>[number]
    ) =>
      accountData.fungible
        .filter((token) =>
          validators.some(
            (validator) => validator.stakeUnitResourceAddress === token.address
          )
        )
        .map((token) => {
          const validator = validators.find(
            (validator) => validator.stakeUnitResourceAddress === token.address
          )!

          const xrdAmount = new BigNumber(validator.totalStake)
            .multipliedBy(token.value)
            .dividedBy(token.totalSupply)
            .toFixed(RET_DECIMAL_PRECISION - 1)

          return {
            type: 'staked',
            account,
            validator,
            stakeUnitAmount: token.value,
            xrdAmount
          } as StakedInfo
        })
        .filter((stakeInfo) => !new BigNumber(stakeInfo.xrdAmount).eq(0))

  const getUnstakeAndClaimInfo =
    (validators: Validator[]) =>
    (
      account: Account,
      accountData: Awaited<ReturnType<typeof getAccountData>>[number],
      currentEpoch: number
    ) => {
      const unstakeTokens = accountData.nonFungible.filter((token) =>
        validators.some(
          (validator) => validator.unstakeClaimResourceAddress === token.address
        )
      )

      let unstaking: UnstakingInfo[] = []
      let readyToClaim: ReadyToClaimInfo[] = []

      for (const token of unstakeTokens) {
        const isClaimable = new BigNumber(token.unstakeData.claimEpoch).lte(
          currentEpoch
        )

        const validator = validators.find(
          (validator) => validator.unstakeClaimResourceAddress === token.address
        )!

        const xrdAmount = new BigNumber(
          token.unstakeData.unstakeAmount
        ).toFixed(RET_DECIMAL_PRECISION - 1)

        if (new BigNumber(xrdAmount).eq(0)) continue

        const stakeInfo = {
          account,
          validator,
          stakeUnitAmount: token.unstakeData.unstakeAmount,
          xrdAmount: xrdAmount,
          claimEpoch: token.unstakeData.claimEpoch
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

  const bookmarkedValidators = bookmarkedValidatorsApi
    .getAll(fetch)
    .unwrapOr([] as string[])
    .then((bookmarked) =>
      bookmarked.reduce<Bookmarked>(
        (prev, curr) => ({ ...prev, [curr]: true }),
        {}
      )
    )
    .then((bookmarked) => {
      bookmarkedValidatorsStore.set(bookmarked)
      return bookmarked
    })
  const stakeInfo = derived(accounts, ($accounts) => {
    if ($accounts.length > 0) {
      return validators.then(async (validators) => {
        const accountData = await getAccountData(
          $accounts.map((a) => a.address)
        )

        const currentEpoch = (await getGatewayStatus()).ledger_state.epoch

        return $accounts.reduce(
          (prev, cur) => {
            const data = accountData.find(
              (d) => d.accountAddress === cur.address
            )!

            const staked = getStakedInfo(validators)(cur, data)
            const { unstaking, readyToClaim } = getUnstakeAndClaimInfo(
              validators
            )(cur, data, currentEpoch)

            return {
              staked: prev.staked.concat(staked),
              unstaking: prev.unstaking.concat(unstaking),
              readyToClaim: prev.readyToClaim.concat(readyToClaim)
            }
          },
          {
            staked: [] as StakedInfo[],
            unstaking: [] as UnstakingInfo[],
            readyToClaim: [] as ReadyToClaimInfo[]
          }
        )
      })
    } else {
      return new Promise<{
        staked: StakedInfo[]
        unstaking: UnstakingInfo[]
        readyToClaim: ReadyToClaimInfo[]
      }>(() => {})
    }
  })

  const validatorAccumulatedStakes = derived(stakeInfo, ($info) =>
    $info.then(async ({ staked, unstaking, readyToClaim }) => {
      const _validators = await validators

      return _validators.reduce<AccumulatedStakes>((prev, cur) => {
        const [
          accumulatedStakes,
          accumulatedUnstaking,
          accumulatedReadyToClaim
        ] = ([staked, unstaking, readyToClaim] as StakeInfo[][]).map((s) =>
          s
            .filter((s) => s.validator.address === cur.address)
            .reduce(
              (acc, { xrdAmount }) => acc.plus(xrdAmount),
              new BigNumber(0)
            )
            .toString()
        )

        prev[cur.address] = {
          accumulatedStakes,
          accumulatedUnstaking,
          accumulatedReadyToClaim
        }
        return prev
      }, {})
    })
  )

  return {
    validatorAccumulatedStakes,
    stakeInfo,
    promises: {
      validators,
      bookmarkedValidators
    }
  }
}
