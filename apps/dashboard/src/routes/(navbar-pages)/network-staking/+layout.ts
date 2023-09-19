import { bookmarkedValidatorsApi } from '../../../server/validators/validators-api'
import type { LayoutLoad } from './$types'
import { getGatewayStatus } from '@api/gateway'
import { getAccountData } from '@api/utils/entities/resource'
import { getValidators } from '@api/utils/entities/validator'
import { accounts, type Account } from '@stores'
import BigNumber from 'bignumber.js'
import { derived } from 'svelte/store'
import {
  getUnstakeAndClaimInfo,
  type ReadyToClaimInfo,
  type StakeInfo,
  type StakedInfo,
  type UnstakingInfo,
  getStakedInfo
} from '@api/utils/staking'
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

export type LoggedInStakedInfo = StakedInfo & {
  account: Account
}

export type LoggedInUnstakingInfo = UnstakingInfo & {
  account: Account
}

export type LoggedInReadyToClaimInfo = ReadyToClaimInfo & {
  account: Account
}

export type LoggedInStakeInfo =
  | LoggedInStakedInfo
  | LoggedInUnstakingInfo
  | LoggedInReadyToClaimInfo

export type Bookmarked = { [validator: string]: boolean }

export const load: LayoutLoad = async ({ fetch, depends }) => {
  depends(_dependency)

  const currentEpoch = (await getGatewayStatus()).ledger_state.epoch

  const validators = getValidators()

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

            const staked = getStakedInfo(validators)(data).map((stake) => ({
              ...stake,
              account: cur
            })) as LoggedInStakedInfo[]

            const { unstaking, readyToClaim } = getUnstakeAndClaimInfo(
              validators
            )(data, currentEpoch)

            return {
              staked: prev.staked.concat(staked),
              unstaking: prev.unstaking.concat(
                unstaking.map((unstake) => ({
                  ...unstake,
                  account: cur
                })) as LoggedInUnstakingInfo[]
              ),
              readyToClaim: prev.readyToClaim.concat(
                readyToClaim.map((claim) => ({
                  ...claim,
                  account: cur
                })) as LoggedInReadyToClaimInfo[]
              )
            }
          },
          {
            staked: [] as LoggedInStakedInfo[],
            unstaking: [] as LoggedInUnstakingInfo[],
            readyToClaim: [] as LoggedInReadyToClaimInfo[]
          }
        )
      })
    } else {
      return new Promise<{
        staked: LoggedInStakedInfo[]
        unstaking: LoggedInUnstakingInfo[]
        readyToClaim: LoggedInReadyToClaimInfo[]
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
