import type { LayoutLoad } from './$types'
import { getGatewayStatus } from '@api/gateway'
import { getAccountData } from '@api/utils/entities/resource'
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

export const prerender = false

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

export const _dependency = 'load:staking-data'

export const load: LayoutLoad = async ({ depends, parent }) =>
  parent()
    .then((data) =>
      Promise.all([data.promises.validators, data.promises.ledger_state])
    )
    .then(async ([validators, ledger_state]) => {
      depends(_dependency)

      const stakeInfo = derived(accounts, async ($accounts) => {
        if ($accounts.length > 0) {
          const accountData = await getAccountData(
            $accounts.map((a) => a.address),
            {
              explicitMetadata: ['validator']
            },
            {
              state_version: ledger_state.state_version
            },
            validators.map((v) => v.unstakeClaimResourceAddress)
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
              )(data, ledger_state.epoch)

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
        currentEpoch: ledger_state.epoch
      }
    })
