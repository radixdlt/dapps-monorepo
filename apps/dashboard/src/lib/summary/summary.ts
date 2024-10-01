import { callApi } from '@api/gateway'
import type { Component } from '@api/utils/entities/component'
import type { Account } from '@api/utils/entities/component/account'
import { transformFungibleResource } from '@api/utils/entities/resource/fungible'
import { getPoolUnits } from '@api/utils/entities/resource/fungible/pool-unit'
import { transformNonFungibleResource } from '@api/utils/entities/resource/non-fungible'
import { handleGatewayResult } from '@dashboard/utils'
import { andThen, flatten, map, pipe } from 'ramda'
import {
  getStakedInfo,
  getUnstakeAndClaimInfoV2,
  type ReadyToClaimInfo,
  type StakedInfo,
  type StakeInfo,
  type UnstakingInfo
} from '@api/utils/staking'

import { ResultAsync } from 'neverthrow'
import { transformNft } from '@api/utils/nfts'
import { type PoolUnit } from '@api/utils/entities/resource/fungible/pool-unit'
import BigNumber from 'bignumber.js'
import type { standardMetadata } from '@api/utils/metadata'
const ERROR_MSG = 'Failed to load entity data.'

export type AccumulatedStakeInfo = {
  validatorAddress: string
  staked: StakedInfo[]
  unstaking: UnstakingInfo[]
  readyToClaim: ReadyToClaimInfo[]
  accumulatedStakes: BigNumber
  accumulatedLiquidStakeUnits: BigNumber
}

export type LayoutDataStakeInfo = {
  accumulatedStakes: Record<string, AccumulatedStakeInfo>
  totalStaked: BigNumber
  totalUnstaking: BigNumber
  totalReadyToClaim: BigNumber
}

const getPoolUnitData =
  (
    stateVersion: number,
    account: Account | Component<unknown, typeof standardMetadata>
  ) =>
  async (poolUnits: PoolUnit[]) => {
    const poolResources = [
      ...new Set(
        poolUnits.flatMap((unit) =>
          unit.nativeResourceDetails.unit_redemption_value.map(
            (value) => value.resource_address
          )
        )
      )
    ]

    const poolTokens = await pipe(
      () =>
        callApi('getEntityDetailsVaultAggregated', poolResources, undefined, {
          state_version: stateVersion
        }),
      handleGatewayResult((_) => ERROR_MSG)
    )()

    return poolUnits.map((unit) => {
      const poolUnitsBalance = account.resources.fungible.find(
        (resource) => resource.address === unit.address
      )!.value

      return {
        poolUnit: {
          poolAddress: unit.metadata.expected.pool.typed.value,
          address: unit.address,
          name: unit.metadata.expected.name?.typed.value,
          icon: unit.metadata.expected.icon_url?.typed.value,
          accountAmount: poolUnitsBalance
        },
        poolTokens: unit.nativeResourceDetails.unit_redemption_value.map(
          (poolToken) => {
            const token = transformFungibleResource(
              poolTokens.find(
                (token) => token.address === poolToken.resource_address
              )!
            )

            const redeemableAmount = new BigNumber(
              poolToken.amount || '0'
            ).multipliedBy(new BigNumber(poolUnitsBalance))

            return {
              name: token.metadata.expected.name?.typed.value,
              icon: token.metadata.expected.icon_url?.typed.value,
              address: token.address,
              redeemableAmount
            }
          }
        )
      }
    })
  }

export const produceSummary = (
  account: Promise<Account | Component<unknown, typeof standardMetadata>>
) => {
  const ledgerState = handleGatewayResult(
    () => "Couldn't fetch current ledger state"
  )(
    callApi('getCurrent').map((result) => ({
      stateVersion: result.ledger_state.state_version,
      epoch: result.ledger_state.epoch
    }))
  )

  const fungibleResources = account.then((acc) =>
    pipe(
      () =>
        callApi(
          'getEntityDetailsVaultAggregated',
          acc.resources.fungible.map((token) => token.address),
          {
            nativeResourceDetails: true
          }
        ),
      handleGatewayResult((_) => ERROR_MSG),
      andThen(map(transformFungibleResource))
    )()
  )

  const nonFungibleResources = account.then((acc) =>
    pipe(
      () =>
        callApi(
          'getEntityDetailsVaultAggregated',
          acc.resources.nonFungible.map((token) => token.address),
          {
            nativeResourceDetails: true
          }
        ),
      handleGatewayResult((_) => ERROR_MSG),
      andThen(map(transformNonFungibleResource))
    )()
  )

  const nfts = Promise.all([account, nonFungibleResources]).then(
    ([acc, nonFungibleResources]) =>
      pipe(
        () => acc.resources.nonFungible,
        map((nonFungibleResource) =>
          pipe(
            () =>
              callApi(
                'getNonFungibleData',
                nonFungibleResource.address,
                nonFungibleResource.ids
              ),
            (result) =>
              result.map(
                map((nftData) =>
                  transformNft(
                    nonFungibleResources.find(
                      (resource) =>
                        resource.address === nonFungibleResource.address
                    )!,
                    nftData
                  )
                )
              )
          )()
        ),
        (results) => ResultAsync.combine(results),
        handleGatewayResult((_) => ERROR_MSG),
        andThen(flatten)
      )()
  )

  const stakeInfo = Promise.all([ledgerState, account, fungibleResources, nfts])
    .then(([ledgerState, accountData, fungibles, nonFungibles]) => {
      return [
        getStakedInfo(fungibles)(accountData),
        getUnstakeAndClaimInfoV2(nonFungibles)(accountData, ledgerState.epoch)
      ] as const
    })
    .then(([staked, unstakeAndClaim]) => {
      let totalStaked = BigNumber(0)
      let totalUnstaking = BigNumber(0)
      let totalReadyToClaim = BigNumber(0)
      const accumulatedStakes: Record<string, AccumulatedStakeInfo> = {}

      const stakeInfo: StakeInfo[] = [
        ...staked,
        ...unstakeAndClaim.unstaking,
        ...unstakeAndClaim.readyToClaim
      ]

      for (const stake of stakeInfo) {
        const validator = stake.validatorAddress

        if (!accumulatedStakes[validator]) {
          accumulatedStakes[validator] = {
            validatorAddress: stake.validatorAddress,
            staked: [],
            unstaking: [],
            readyToClaim: [],
            accumulatedStakes: BigNumber(0),
            accumulatedLiquidStakeUnits: BigNumber(0)
          }
        }

        switch (stake.type) {
          case 'staked':
            accumulatedStakes[validator].staked.push(stake)
            accumulatedStakes[validator].accumulatedStakes = accumulatedStakes[
              validator
            ].accumulatedStakes.plus(stake.xrdAmount)
            totalStaked = totalStaked.plus(stake.xrdAmount)
            accumulatedStakes[validator].accumulatedLiquidStakeUnits =
              accumulatedStakes[validator].accumulatedLiquidStakeUnits.plus(
                stake.stakeUnitsAmount
              )
            break
          case 'unstaking':
            accumulatedStakes[validator].unstaking.push(stake)
            totalUnstaking = totalUnstaking.plus(stake.xrdAmount)
            break
          case 'readyToClaim':
            accumulatedStakes[validator].readyToClaim.push(stake)
            totalReadyToClaim = totalReadyToClaim.plus(stake.xrdAmount)
            break
        }
      }

      return {
        accumulatedStakes,
        totalStaked,
        totalUnstaking,
        totalReadyToClaim
      }
    })

  const poolData = Promise.all([account, fungibleResources, ledgerState]).then(
    ([account, fungibles, { stateVersion }]) => {
      const poolUnits = getPoolUnits(fungibles)
      return getPoolUnitData(stateVersion, account)(poolUnits)
    }
  )

  return {
    poolData,
    stakeInfo,
    fungibleResources,
    nonFungibleResources,
    nfts,
    stateVersion: ledgerState.then((ledgerState) => ledgerState.stateVersion)
  }
}
