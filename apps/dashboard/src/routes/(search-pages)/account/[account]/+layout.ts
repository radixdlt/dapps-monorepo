import { getAccountData } from '@api/utils/entities/resource'
import type { LayoutLoad } from './$types'
import { getValidators } from '@api/utils/entities/validator'
import { getPoolUnits, type PoolUnit } from '@api/utils/entities/pool-unit'
import {
  getStakedInfo,
  getUnstakeAndClaimInfo,
  type StakeInfo
} from '@api/utils/staking'
import BigNumber from 'bignumber.js'
import {
  getEntityDetails,
  getGatewayStatus,
  getSingleEntityDetails
} from '@api/gateway'
import type { AccumulatedStakes } from '../../../(navbar-pages)/network-staking/proxy+layout'
import { filter, map } from 'ramda'
import { transformPool } from '@api/utils/entities/pool'
import { transformFungibleResource } from '@api/utils/entities/resource'

export const prerender = false

export const load: LayoutLoad = ({ params }) => {
  const accountData = getAccountData([params.account], {
    explicitMetadata: ['name', 'tags', 'icon_url']
  }).then((data) => data[0])

  const validators = getValidators()

  const currentEpoch = getGatewayStatus().then(
    (status) => status.ledger_state.epoch
  )

  const stakeInfo = Promise.all([validators, accountData, currentEpoch])
    .then(
      ([validators, accountData, currentEpoch]) =>
        [
          getStakedInfo(validators)(accountData),
          getUnstakeAndClaimInfo(validators)(accountData, currentEpoch)
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

  const getPoolUnitData = async (
    poolUnit: PoolUnit
  ): Promise<
    | {
        poolUnit: {
          name?: string
          icon?: string
          address: string
        }
        poolTokens: {
          name?: string
          icon?: string
          amount: BigNumber
        }[]
      }
    | undefined
  > => {
    const poolAddress = poolUnit.metadata.standard.pool?.value

    if (!poolAddress) return

    const pool = await getSingleEntityDetails(poolAddress).then(transformPool)

    if (!pool.metadata.standard.pool_unit) return

    const poolResources = await getEntityDetails(
      pool.metadata.standard.pool_resources?.value || []
    ).then(map(transformFungibleResource))

    return {
      poolUnit: {
        address: poolUnit.address,
        name: poolUnit.metadata.standard.name?.value,
        icon: poolUnit.metadata.standard.iconUrl?.value
      },
      poolTokens: poolResources.map((resource) => ({
        name: resource.metadata.standard.name?.value,
        icon: resource.metadata.standard.iconUrl?.value,
        amount: new BigNumber(resource.value)
      }))
    }
  }

  const poolUnits = accountData
    .then(({ fungible }) => getPoolUnits(fungible))
    .then(map(getPoolUnitData))
    .then(filter((poolUnit) => poolUnit !== undefined))
    .then((poolUnits) => Promise.all(poolUnits))
    .then((poolUnits) => poolUnits as NonNullable<(typeof poolUnits)[number]>[])

  return {
    address: params.account,
    promises: {
      accountData,
      stakeInfo,
      poolUnits
    }
  }
}
