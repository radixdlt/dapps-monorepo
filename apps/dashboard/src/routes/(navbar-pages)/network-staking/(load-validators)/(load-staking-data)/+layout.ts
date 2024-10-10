import type { LayoutLoad } from './$types'
import { getAccountDataV2 } from '@api/_deprecated/utils/entities/resource'
import { accounts, xrdAddress, type Account } from '@stores'
import BigNumber from 'bignumber.js'
import { derived } from 'svelte/store'
import {
  getUnstakeAndClaimInfo,
  type ReadyToClaimInfo,
  type StakeInfo,
  type StakedInfo,
  type UnstakingInfo,
  getStakedInfo
} from '@api/_deprecated/utils/staking'
import { callApi } from '@api/gateway'
import { errAsync, ResultAsync } from 'neverthrow'

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

type StakeInfoObject = {
  staked: LoggedInStakedInfo[]
  unstaking: LoggedInUnstakingInfo[]
  readyToClaim: LoggedInReadyToClaimInfo[]
}

const emptyStakeInfoObject = {
  staked: [],
  unstaking: [],
  readyToClaim: []
} as StakeInfoObject

export type LoggedInStakeInfo =
  | LoggedInStakedInfo
  | LoggedInUnstakingInfo
  | LoggedInReadyToClaimInfo

export const _dependency = 'load:staking-data'

export const load: LayoutLoad = async ({ depends, parent }) => {
  const parentData = parent()

  depends(_dependency)

  const sharedAccountsEntityDetails = derived(accounts, ($accounts) =>
    ResultAsync.fromSafePromise(parentData)
      .andThen((data) =>
        ResultAsync.fromSafePromise(data.promises.ledger_state)
      )
      .andThen((_ledger_state) =>
        callApi(
          'getEntityDetailsVaultAggregated',
          $accounts.map((a) => a.address),
          {
            explicitMetadata: ['validator']
          },
          {
            state_version: _ledger_state.state_version
          }
        )
      )
  )

  const stakeInfo = derived(
    sharedAccountsEntityDetails,
    async ($entityDetails) => {
      const details = await $entityDetails
      const _validators = await (await parentData).promises.validators
      const _ledger_state = await (await parentData).promises.ledger_state
      if (details.isErr()) {
        return emptyStakeInfoObject
      }
      const entityDetails = details.value
      if (entityDetails.length > 0) {
        const accountData = await getAccountDataV2(
          entityDetails,
          {
            explicitMetadata: ['validator']
          },
          {
            state_version: _ledger_state.state_version
          },
          _validators.map((v) => v.unstakeClaimResourceAddress)
        )

        return entityDetails.reduce(
          (prev, cur) => {
            const data = accountData.find(
              (d) => d.accountAddress === cur.address
            )!

            const staked = getStakedInfo(_validators)(data).map((stake) => ({
              ...stake,
              account: {
                address: cur.address
              }
            })) as LoggedInStakedInfo[]

            const { unstaking, readyToClaim } = getUnstakeAndClaimInfo(
              _validators
            )(data, _ledger_state.epoch)

            return {
              staked: prev.staked.concat(staked),
              unstaking: prev.unstaking.concat(
                unstaking.map((unstake) => ({
                  ...unstake,
                  account: {
                    address: cur.address
                  }
                })) as LoggedInUnstakingInfo[]
              ),
              readyToClaim: prev.readyToClaim.concat(
                readyToClaim.map((claim) => ({
                  ...claim,
                  account: {
                    address: cur.address
                  }
                })) as LoggedInReadyToClaimInfo[]
              )
            }
          },
          { ...emptyStakeInfoObject }
        )
      } else {
        return new Promise<StakeInfoObject>(() => {})
      }
    }
  )

  const validatorAccumulatedStakes = derived(stakeInfo, ($info) =>
    $info.then(async ({ staked, unstaking, readyToClaim }) => {
      const _validators = await (await parentData).promises.validators
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

  const totalXrdBalance = derived(
    [xrdAddress, sharedAccountsEntityDetails],
    ([$xrdAddress, $details]) => {
      if (!$xrdAddress) {
        return errAsync({ code: 'NO_XRD_ADDRESS' })
      }

      return $details
        .map((details) => {
          return details
            .reduce((acc, cur) => {
              const xrdValueForSingleAccount = cur.fungible_resources.items
                .find((token) => token.resource_address === $xrdAddress)
                ?.vaults.items.reduce(
                  (vaultAcc, vault) => vaultAcc.plus(vault.amount),
                  new BigNumber(0)
                )

              return acc.plus(xrdValueForSingleAccount || BigNumber(0))
            }, new BigNumber(0))
            .toString()
        })
        .mapErr(() => ({
          code: 'COULD_NOT_FETCH_ACCOUNTS_DETAILS'
        }))
    }
  )

  return {
    validatorAccumulatedStakes,
    stakeInfo,
    totalXrdBalance
  }
}
