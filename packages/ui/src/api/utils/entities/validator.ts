import type {
  StateEntityDetailsResponseFungibleResourceDetails,
  ValidatorCollectionItem,
  ValidatorUptimeCollectionItem
} from '@radixdlt/babylon-gateway-api-sdk'
import { transformMetadata } from '../metadata'
import type { _Entity } from '.'
import {
  getEntityDetails,
  getValidatorUptime,
  getValidatorsListWithLedgerState
} from '@api/gateway'
import BigNumber from 'bignumber.js'
import { andThen, map, pipe } from 'ramda'

export type Validator = _Entity<
  'validator',
  ['name', 'symbol', 'icon_url', 'description', 'website']
> & {
  ownerAddress: string
  totalStakeInXRD: string
  ownerStake: string
  percentageOwnerStake: number
  apy: number
  fee: number
  uptimePercentages: {
    '1day': number
    '1week': number
    '1month': number
    '3months': number
    '6months': number
    '1year': number
    alltime: number
  }
  acceptsStake: boolean
  percentageTotalStake: number
  stakeUnitResourceAddress: string
  unstakeClaimResourceAddress: string
  totalStakeUnits: string
}

const ONE_DAY_MS = 1000 * 60 * 60 * 24
const ONE_WEEK_MS = ONE_DAY_MS * 7
const ONE_MONTH_MS = ONE_DAY_MS * 30
const THREE_MONTHS_MS = ONE_DAY_MS * 90
const SIX_MONTHS_MS = ONE_DAY_MS * 180
const ONE_YEAR_MS = ONE_DAY_MS * 365

const dateMsAgo = (ms: number) => new Date(Date.now() - ms)

const getValidatorUptimeSinceDate =
  (addresses: string[]) => (timestamp: Date | number) =>
    getValidatorUptime(addresses, timestamp)
      .then(({ validators: { items } }) => items)
      .catch(() => [])

const calculateUptimePercentage = ({
  proposals_made,
  proposals_missed
}: ValidatorUptimeCollectionItem) => {
  if (!proposals_made || !proposals_missed) return 0

  let total_proposals = proposals_made! + proposals_missed!

  let uptimePercentage = 100

  if (total_proposals > 0) {
    uptimePercentage = new BigNumber(proposals_made!)
      .multipliedBy(100)
      .dividedBy(total_proposals)
      .toNumber()
  }

  return uptimePercentage
}

const getUptimePercentages = (validators: ValidatorCollectionItem[]) =>
  pipe(
    () => [
      ONE_DAY_MS,
      ONE_WEEK_MS,
      ONE_MONTH_MS,
      THREE_MONTHS_MS,
      SIX_MONTHS_MS,
      ONE_YEAR_MS
    ],
    map(dateMsAgo),
    (timestamps) => [...timestamps, 1], // 1 is the first state version
    map(getValidatorUptimeSinceDate(validators.map(({ address }) => address))),
    (items) => Promise.all(items),
    andThen(map(map(calculateUptimePercentage))),
    andThen((uptimes) =>
      validators.map((_, i) => ({
        '1day': uptimes[0][i],
        '1week': uptimes[1][i],
        '1month': uptimes[2][i],
        '3months': uptimes[3][i],
        '6months': uptimes[4][i],
        '1year': uptimes[5][i],
        alltime: uptimes[6][i]
      }))
    )
  )()

export const transformValidatorResponse =
  (withStakeUnits = true, withUptime = true) =>
  async ({
    aggregatedEntities,
    ledger_state: { state_version }
  }: Awaited<ReturnType<typeof getValidatorsListWithLedgerState>>): Promise<
    Validator[]
  > => {
    const stakeUnits = withStakeUnits
      ? await getEntityDetails(
          aggregatedEntities.map(
            (v) => (v.state as any).stake_unit_resource_address as string
          ),
          undefined,
          { state_version }
        )
      : []

    const uptimes = withUptime
      ? await getUptimePercentages(aggregatedEntities)
      : []

    return aggregatedEntities.map((validator, i) => {
      const state: any = validator.state || {}

      const stakeUnitResourceAddress =
        state.stake_unit_resource_address as string

      return {
        type: 'validator',
        address: validator.address,
        fee: (state.validator_fee_factor || 0) * 100,
        percentageTotalStake: validator.active_in_epoch?.stake_percentage || 0,

        stakeUnitResourceAddress,
        unstakeClaimResourceAddress:
          state.claim_token_resource_address as string,

        totalStakeUnits: (
          stakeUnits[i]
            .details as StateEntityDetailsResponseFungibleResourceDetails
        ).total_supply,
        totalStakeInXRD: validator.stake_vault.balance,

        metadata: transformMetadata(validator, [
          'name',
          'symbol',
          'icon_url',
          'description',
          'tags',
          'website'
        ]),

        uptimePercentages: uptimes[i],
        ownerAddress: '',
        ownerStake: '0',
        percentageOwnerStake: 0,
        apy: 0,
        acceptsStake: state.accepts_delegated_stake
      }
    })
  }

export const getValidators = (withStakeUnits = true, withUptime = true) =>
  getValidatorsListWithLedgerState().then(
    transformValidatorResponse(withStakeUnits, withUptime)
  )
