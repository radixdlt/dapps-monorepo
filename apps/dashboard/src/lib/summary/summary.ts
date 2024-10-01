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
import {
  getRedeemablePoolTokenAmount,
  transformPool
} from '@api/utils/entities/component/pool'

import { ResultAsync } from 'neverthrow'
import { transformNft } from '@api/utils/nfts'

import type { EntityType } from '@api/utils/entities/component'
import { http } from '@common/http'
import { type PoolUnit } from '@api/utils/entities/resource/fungible/pool-unit'
import BigNumber from 'bignumber.js'
import type { standardMetadata } from '@api/utils/metadata'
import { errorPage } from '@dashboard/stores'
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

const getEntityTypes = async (
  addresses: string[]
): Promise<{ [address: string]: EntityType }> =>
  http.post('/api/ret/entity-type', {
    addresses
  })

const getEntityDetailsFn = (stateVersion: number) => (addresses: string[]) =>
  pipe(
    () =>
      callApi(
        'getEntityDetailsVaultAggregated',
        addresses,
        {
          dappTwoWayLinks: true,
          nativeResourceDetails: true
        },
        {
          state_version: stateVersion
        }
      ),
    handleGatewayResult((_) => ERROR_MSG)
  )()

const getPoolUnitData =
  (
    stateVersion: number,
    account: Account | Component<unknown, typeof standardMetadata>
  ) =>
  async (poolUnits: PoolUnit[]) => {
    const poolAddresses = poolUnits.map(
      (unit) => unit.metadata.expected.pool.typed.value
    )

    if (poolAddresses.some((a) => a === undefined)) {
      errorPage.set({
        message: ERROR_MSG
      })

      throw 'Pool not found.'
    }

    const poolEntities = await pipe(
      () =>
        callApi(
          'getEntityDetailsVaultAggregated',
          poolAddresses as string[],
          {
            dappTwoWayLinks: true,
            nativeResourceDetails: true
          },
          { state_version: stateVersion }
        ),
      handleGatewayResult((_) => ERROR_MSG)
    )()

    const pools = poolEntities.map(transformPool)

    const poolTokens = await pipe(
      () =>
        callApi(
          'getEntityDetailsVaultAggregated',
          pools.flatMap(
            (pool) => pool.metadata.expected.pool_resources.typed.values
          ),
          {
            dappTwoWayLinks: true,
            nativeResourceDetails: true
          },
          { state_version: stateVersion }
        ),
      handleGatewayResult((_) => ERROR_MSG)
    )()

    return poolUnits.map((unit) => {
      const pool = pools.find(
        (pool) => pool.address === unit.metadata.expected.pool.typed.value
      )!

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
        poolTokens: pool.metadata.expected.pool_resources.typed.values.map(
          (poolToken) => {
            const token = transformFungibleResource(
              poolTokens.find((token) => token.address === poolToken)!
            )

            return {
              name: token.metadata.expected.name?.typed.value,
              icon: token.metadata.expected.icon_url?.typed.value,
              address: token.address,
              redeemableAmount: getRedeemablePoolTokenAmount(
                token,
                unit,
                pool,
                poolUnitsBalance
              )
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
            dappTwoWayLinks: true,
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
            dappTwoWayLinks: true,
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

  const poolData = pipe(
    () => Promise.all([account, fungibleResources, ledgerState]),
    andThen(([account, fungibles, { stateVersion }]) =>
      pipe(() => {
        return getPoolUnits(
          fungibles,
          getEntityTypes,
          getEntityDetailsFn(stateVersion)
        )
      }, andThen(getPoolUnitData(stateVersion, account)))()
    )
  )()

  return {
    poolData,
    stakeInfo,
    fungibleResources,
    nonFungibleResources,
    nfts,
    stateVersion: ledgerState.then((ledgerState) => ledgerState.stateVersion)
  }
}
