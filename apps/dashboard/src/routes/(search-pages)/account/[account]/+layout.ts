import { getAccountData } from '@api/utils/entities/resource'
import type { LayoutLoad } from './$types'
import { getValidators } from '@api/utils/entities/validator'
import { getPoolUnitData, getPoolUnits } from '@api/utils/entities/pool-unit'
import {
  getStakedInfo,
  getUnstakeAndClaimInfo,
  type StakeInfo
} from '@api/utils/staking'
import BigNumber from 'bignumber.js'
import { getGatewayStatus } from '@api/gateway'
import { filter, map } from 'ramda'
import type { AccumulatedStakes } from '../../../(navbar-pages)/network-staking/(load-validators)/(load-staking-data)/proxy+layout'

export const prerender = false

export const load: LayoutLoad = ({ params }) => {
  const accountData = getAccountData([params.account], {
    explicitMetadata: ['name', 'tags', 'icon_url']
  }).then((data) => data[0])

  const validatorResponse = getValidators(undefined, false, false)

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

  const poolUnits = accountData
    .then(({ fungible }) => getPoolUnits(fungible))
    .then(map(getPoolUnitData))
    .then(filter((poolUnit) => poolUnit !== undefined))
    .then((poolUnits) => Promise.all(poolUnits))
    .then((poolUnits) => poolUnits as NonNullable<(typeof poolUnits)[number]>[])

  return {
    address: params.account,
    promises: {
      stateVersion: validatorResponse.then(
        (response) => response.ledger_state.state_version
      ),
      accountData,
      stakeInfo,
      poolUnits
    }
  }
}
