import {
  getAccountDataNew,
  transformFungibleResource
} from '@api/utils/entities/resource'
import type { LayoutLoad } from './$types'
import { getValidators } from '@api/utils/entities/validator'
import { getPoolUnits, type PoolUnit } from '@api/utils/entities/pool-unit'
import {
  getStakedInfo,
  getUnstakeAndClaimInfo,
  type StakeInfo
} from '@api/utils/staking'
import BigNumber from 'bignumber.js'
import { andThen, pipe } from 'ramda'
import type { AccumulatedStakes } from '../../../(navbar-pages)/network-staking/(load-validators)/(load-staking-data)/proxy+layout'
import { handleGatewayResult } from '../../../../utils'
import { handleLookupGatewayResult } from '../../utils'
import {
  getRedeemablePoolTokenAmount,
  transformPool
} from '@api/utils/entities/pool'
import { callApi } from '@api/gateway'
import { errorPage } from '../../../../stores'
import { resourcesCacheClient } from '@api/utils/resource-cache-client'
import type { NonFungible } from '@api/utils/nfts'
import { http } from '@common/http'
import type { EntityType } from '@common/ret'

const ERROR_MSG = 'Failed to load account data.'

const getEntityTypes = async (
  addresses: string[]
): Promise<{ [address: string]: EntityType }> =>
  http.post('/api/ret/entity-type', {
    addresses
  })

const getEntityDetailsFn = (stateVersion: number) => (addresses: string[]) =>
  pipe(
    () =>
      callApi('getEntityDetailsVaultAggregated', addresses, undefined, {
        state_version: stateVersion
      }),
    handleGatewayResult((_) => ERROR_MSG)
  )()

const getPoolUnitData =
  (stateVersion: number) => async (poolUnits: PoolUnit[]) => {
    const poolAddresses = poolUnits.map(
      (unit) => unit.metadata.standard.pool?.value
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
          undefined,
          { state_version: stateVersion }
        ),
      handleGatewayResult((_) => ERROR_MSG)
    )()

    const pools = poolEntities.map(transformPool)

    const poolTokens = await pipe(
      () =>
        callApi(
          'getEntityDetailsVaultAggregated',
          pools.flatMap((pool) => pool.metadata.standard.pool_resources!.value),
          undefined,
          { state_version: stateVersion }
        ),
      handleGatewayResult((_) => ERROR_MSG)
    )()

    return poolUnits.map((unit) => {
      const pool = pools.find(
        (pool) => pool.address === unit.metadata.standard.pool!.value
      )!
      const poolEntity = poolEntities.find(
        (poolEntity) => poolEntity.address === pool.address
      )!

      return {
        poolUnit: {
          address: unit.address,
          name: unit.metadata.standard.name?.value,
          icon: unit.metadata.standard.icon_url?.value
        },
        poolTokens: pool.metadata.standard.pool_resources!.value.map(
          (poolToken) => {
            const token = transformFungibleResource(
              poolTokens.find((token) => token.address === poolToken)!,
              poolEntity.fungible_resources.items.find(
                (fungible) => fungible.resource_address === poolToken
              )!
            )

            return {
              name: token.metadata.standard.name?.value,
              icon: token.metadata.standard.icon_url?.value,
              redeemableAmount: getRedeemablePoolTokenAmount(token, unit)
            }
          }
        )
      }
    })
  }

export const load: LayoutLoad = ({ params }) => {
  const accountData = pipe(
    () =>
      getAccountDataNew([params.account], {
        explicitMetadata: ['name', 'tags', 'icon_url']
      }),
    handleLookupGatewayResult
  )().then((accountData) => {
    const data = accountData[0]
    resourcesCacheClient.addFungibles(data.fungible)
    data.nonFungible.forEach((nft) => {
      resourcesCacheClient.addNonFungibles([nft.resource])
      nft.nonFungibles
        .filter((nft): nft is NonFungible => typeof nft !== 'string')
        .forEach((nft) => {
          resourcesCacheClient.addNonFungiblesData([nft])
        })
    })
    return data
  })

  const validatorResponse = pipe(
    () => getValidators(undefined, false, false),
    (result) => handleGatewayResult((_) => ERROR_MSG)(result)
  )()

  const stateVersion = validatorResponse.then(
    (response) => response.ledger_state.state_version
  )

  const stakeInfo = Promise.all([validatorResponse, accountData])
    .then(
      ([response, accountData]) =>
        [
          getStakedInfo(response.validators)(accountData),
          getUnstakeAndClaimInfo(response.validators)(
            accountData,
            response.ledger_state.epoch
          )
        ] as const
    )
    .then(([staked, unstakeAndClaim]) => {
      const accumulatedStakes: AccumulatedStakes & {
        [validator: string]: { validatorName: string }
      } = {}

      const stakeInfo: StakeInfo[] = [
        ...staked,
        ...unstakeAndClaim.unstaking,
        ...unstakeAndClaim.readyToClaim
      ]

      for (const stake of stakeInfo) {
        const validator = stake.validator.address
        const validatorName = stake.validator.metadata.standard.name?.value

        if (!accumulatedStakes[validator]) {
          accumulatedStakes[validator] = {
            validatorName: validatorName || '',
            accumulatedStakes: '0',
            accumulatedUnstaking: '0',
            accumulatedReadyToClaim: '0'
          }
        }

        switch (stake.type) {
          case 'staked':
            accumulatedStakes[validator].accumulatedStakes = new BigNumber(
              accumulatedStakes[validator].accumulatedStakes
            )
              .plus(stake.xrdAmount)
              .toFixed()
            break
          case 'unstaking':
            accumulatedStakes[validator].accumulatedUnstaking = new BigNumber(
              accumulatedStakes[validator].accumulatedUnstaking
            )
              .plus(stake.xrdAmount)
              .toFixed()
            break
          case 'readyToClaim':
            accumulatedStakes[validator].accumulatedReadyToClaim =
              new BigNumber(
                accumulatedStakes[validator].accumulatedReadyToClaim
              )
                .plus(stake.xrdAmount)
                .toFixed()
            break
        }
      }

      return Object.entries(accumulatedStakes).map(
        ([
          _,
          {
            validatorName,
            accumulatedStakes,
            accumulatedUnstaking,
            accumulatedReadyToClaim
          }
        ]) => ({
          validatorName,
          staking: new BigNumber(accumulatedStakes),
          unstaking: new BigNumber(accumulatedUnstaking),
          readyToClaim: new BigNumber(accumulatedReadyToClaim)
        })
      )
    })
  const poolData = pipe(
    () => Promise.all([accountData, stateVersion]),
    andThen(([{ fungible }, stateVersion]) =>
      pipe(() => {
        return getPoolUnits(
          fungible,
          getEntityTypes,
          getEntityDetailsFn(stateVersion)
        )
      }, andThen(getPoolUnitData(stateVersion)))()
    )
  )()

  return {
    address: params.account,
    promises: {
      stateVersion,
      accountData,
      stakeInfo,
      poolData
    }
  }
}
