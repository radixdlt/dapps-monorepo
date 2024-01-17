import type { LayoutLoad } from './$types'
import {
  getStakedInfo,
  getUnstakeAndClaimInfo,
  type StakeInfo
} from '@common/api/utils/staking'
import BigNumber from 'bignumber.js'
import { andThen, flatten, map, pipe } from 'ramda'
import type { AccumulatedStakes } from '../../../(navbar-pages)/network-staking/(load-validators)/(load-staking-data)/proxy+layout'
import { handleGatewayResult } from '../../../../utils'
import { callApi } from '@common/api/gateway'
import { errorPage } from '../../../../stores'
import {
  getRedeemablePoolTokenAmount,
  transformPool
} from '@common/api/utils/entities/component/pool'
import { transformFungibleResource } from '@common/api/utils/entities/resource/fungible'
import {
  transformAccount,
  type Account
} from '@common/api/utils/entities/component/account'
import { getValidators } from '@common/api/utils/entities/component/validator'
import { ResultAsync } from 'neverthrow'
import { transformNft } from '@common/api/utils/nfts'
import { transformNonFungibleResource } from '@common/api/utils/entities/resource/non-fungible'
import type { EntityType } from '@common/api/utils/entities/component'
import { http } from '@common/utils/http'
import {
  getPoolUnits,
  type PoolUnit
} from '@common/api/utils/entities/resource/fungible/pool-unit'
import { getResourcesFromAuth, handleLookupGatewayResult } from '../../utils'

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
  (stateVersion: number, account: Account) => async (poolUnits: PoolUnit[]) => {
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
          pools.flatMap(
            (pool) => pool.metadata.expected.pool_resources.typed.values
          ),
          undefined,
          { state_version: stateVersion }
        ),
      handleGatewayResult((_) => ERROR_MSG)
    )()

    return poolUnits.map((unit) => {
      const pool = pools.find(
        (pool) => pool.address === unit.metadata.expected.pool.typed.value
      )!

      return {
        poolUnit: {
          address: unit.address,
          name: unit.metadata.expected.name?.typed.value,
          icon: unit.metadata.expected.icon_url?.typed.value
        },
        poolTokens: pool.metadata.expected.pool_resources.typed.values.map(
          (poolToken) => {
            const token = transformFungibleResource(
              poolTokens.find((token) => token.address === poolToken)!
            )

            return {
              name: token.metadata.expected.name?.typed.value,
              icon: token.metadata.expected.icon_url?.typed.value,
              redeemableAmount: getRedeemablePoolTokenAmount(
                token,
                unit,
                account,
                pool
              )
            }
          }
        )
      }
    })
  }

export const load: LayoutLoad = ({ params }) => {
  const account = pipe(
    () => callApi('getEntityDetailsVaultAggregated', [params.account]),
    handleLookupGatewayResult,
    andThen((accounts) => accounts[0]),
    andThen(transformAccount)
  )()

  const validatorResponse = pipe(
    () => getValidators(undefined, false, false),
    (result) => handleGatewayResult((_) => ERROR_MSG)(result)
  )()

  const stateVersion = validatorResponse.then(
    (response) => response.ledger_state.state_version
  )

  const fungibleResources = account.then((acc) =>
    pipe(
      () =>
        callApi(
          'getEntityDetailsVaultAggregated',
          acc.resources.fungible.map((token) => token.address)
        ),
      handleGatewayResult((_) => ERROR_MSG),
      andThen(map(transformFungibleResource))
    )()
  )

  const nonFungibleResources = Promise.all([account, validatorResponse]).then(
    ([acc, { validators }]) =>
      pipe(
        () =>
          callApi(
            'getEntityDetailsVaultAggregated',
            acc.resources.nonFungible.map((token) => token.address)
          ),
        handleGatewayResult((_) => ERROR_MSG),
        andThen(
          pipe(
            map((entity) => transformNonFungibleResource(entity, validators)),
            (x) => Promise.all(x)
          )
        )
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

  const stakeInfo = Promise.all([
    validatorResponse,
    account,
    fungibleResources,
    nfts
  ])
    .then(
      ([response, accountData, fungibles, nonFungibles]) =>
        [
          getStakedInfo(response.validators, fungibles)(accountData),
          getUnstakeAndClaimInfo(response.validators)(nonFungibles)(
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
        const validatorName =
          stake.validator.metadata.expected.name?.typed.value

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
    () => Promise.all([account, fungibleResources, stateVersion]),
    andThen(([account, fungibles, stateVersion]) =>
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
    address: params.account,
    promises: {
      stateVersion,
      account,
      stakeInfo,
      poolData,
      fungibleResources,
      nonFungibleResources,
      nfts,
      authResources: account.then(({ auth }) => getResourcesFromAuth(auth))
    }
  }
}
