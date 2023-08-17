import { bookmarkedValidatorsApi } from '../../../server/validators/validators-api'
import type { LayoutLoad } from './$types'
import {
  getEntityDetails,
  getGatewayStatus,
  getValidatorsListWithLedgerState
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

export const load: LayoutLoad = async ({ fetch, depends }) => {
  depends(_dependency)

  const currentEpoch = (await getGatewayStatus()).ledger_state.epoch

  let resolveStateVersion: (stateVersion: number) => void
  const validatorsStateVersion = new Promise<number>(
    (resolve) => (resolveStateVersion = resolve)
  )

  const validators = getValidatorsListWithLedgerState().then(
    async ({ aggregatedEntities: items, ledger_state: { state_version } }) => {
      resolveStateVersion(state_version)

      const stakeUnits = await getEntityDetails(
        items.map(
          (v) => (v.state as any).value.stake_unit_resource_address as string
        ),
        undefined,
        { state_version }
      )

      return items.map((validator, i) => {
        const state: any = validator.state || {}

        const stakeUnitResourceAddress = state.value
          .stake_unit_resource_address as string

        return {
          name: getEnumStringMetadata('name')(validator.metadata),
          website: getEnumStringMetadata('url')(validator.metadata),
          address: validator.address,
          fee: (state.value.validator_fee_factor || 0) * 100,
          percentageTotalStake:
            validator.active_in_epoch?.stake_percentage || 0,

          stakeUnitResourceAddress,
          unstakeClaimResourceAddress: state.value
            .unstake_claim_token_resource_address as string,

          totalStakeUnits: (
            stakeUnits[i]
              .details as StateEntityDetailsResponseFungibleResourceDetails
          ).total_supply,
          totalStakeInXRD: validator.stake_vault.balance,

          // TODO:
          ownerAddress: '',
          ownerStake: '0',
          percentageOwnerStake: 0,
          apy: 0,
          uptime: 0,
          acceptsStake: true
        } as Validator
      })
    }
  )

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
            account,
            validator,
            stakeUnitsAmount: stakeUnitToken.value,
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

        const stakeUnitsAmount = accountData.fungible.find(
          (token) => token.address === validator.stakeUnitResourceAddress
        )!.value

        const stakeInfo = {
          account,
          validator,
          xrdAmount,
          claimEpoch: token.unstakeData.claimEpoch,
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
          $accounts.map((a) => a.address),
          {
            explicitMetadata: ['validator']
          }
        )

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
    },
    currentEpoch
  }
}
