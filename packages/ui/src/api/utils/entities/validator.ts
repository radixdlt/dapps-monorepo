import type {
  StateEntityDetailsResponseFungibleResourceDetails,
  ValidatorCollectionItem,
  ValidatorUptimeCollectionItem
} from '@radixdlt/babylon-gateway-api-sdk'
import { getEnumStringMetadata, transformMetadata } from '../metadata'
import type { _Entity } from '.'
import {
  getEntityDetails,
  getNonFungibleLocation,
  getValidatorUptime,
  getValidatorsListWithLedgerState
} from '@api/gateway'
import BigNumber from 'bignumber.js'
import { andThen, isNil, map, pick, pipe, prop, reduce, reject } from 'ramda'
import { YEARLY_XRD_EMISSIONS } from '@constants'

export type Validator = _Entity<
  'validator',
  ['name', 'icon_url', 'description', 'info_url']
> & {
  ownerAddress?: string
  totalStakeInXRD: BigNumber
  ownerStake: BigNumber
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
  totalStakeUnits: BigNumber
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
    getValidatorUptime(addresses, timestamp).catch(() => [])

const calculateUptimePercentage = ({
  proposals_made,
  proposals_missed
}: ValidatorUptimeCollectionItem) => {
  if (proposals_made === undefined || proposals_missed === undefined) return 0

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
  (
    validatorOwnerBadgeResource?: string,
    withStakeUnits = true,
    withUptime = true
  ) =>
  async ({
    aggregatedEntities,
    ledger_state
  }: Awaited<ReturnType<typeof getValidatorsListWithLedgerState>>): Promise<{
    validators: Validator[]
    ledger_state: typeof ledger_state
  }> => {
    const stakeUnits = withStakeUnits
      ? await getEntityDetails(
          aggregatedEntities.map(
            (v) => (v.state as any).stake_unit_resource_address as string
          ),
          undefined,
          { state_version: ledger_state.state_version }
        )
      : undefined

    const uptimes = withUptime
      ? await getUptimePercentages(aggregatedEntities)
      : []

    let owners: { owner?: string; vaultAddress: string }[] = []
    let ownerVaultAddresses: {
      owning_vault_address?: string
      non_fungible_id: string
    }[] = []
    let ownerBadgeIds: string[] = []

    if (validatorOwnerBadgeResource) {
      ownerBadgeIds = aggregatedEntities.map((validator) =>
        getEnumStringMetadata('owner_badge')(validator.metadata)
      )

      const ownerData = await getNonFungibleLocation(
        validatorOwnerBadgeResource,
        ownerBadgeIds
      )

      ownerVaultAddresses = pipe(
        () => ownerData,
        map(pick(['owning_vault_address', 'non_fungible_id']))
      )()

      owners = await pipe(
        () =>
          getEntityDetails(
            pipe(
              () => ownerVaultAddresses,
              map(prop('owning_vault_address')),
              (address) => reject(isNil, address)
            )(),
            { ancestorIdentities: true },
            { state_version: ledger_state.state_version }
          ),
        andThen(
          map((detail) => ({
            owner: detail.ancestor_identities?.owner_address,
            vaultAddress: detail.address
          }))
        )
      )()
    }

    const totalAmountStaked = pipe(
      () => aggregatedEntities,
      reduce(
        (prev, cur) => prev.plus(cur.stake_vault.balance),
        new BigNumber(0)
      )
    )()

    const validators = aggregatedEntities.map((validator, i) => {
      const state: any = validator.state || {}

      const stakeUnitResourceAddress =
        state.stake_unit_resource_address as string

      let totalStakeUnits = new BigNumber(0)
      let ownerStake = new BigNumber(0)

      const totalStakeInXRD = new BigNumber(validator.stake_vault.balance)

      if (stakeUnits) {
        totalStakeUnits = new BigNumber(
          (
            stakeUnits[i]
              .details as StateEntityDetailsResponseFungibleResourceDetails
          ).total_supply
        )

        ownerStake = totalStakeUnits.isZero()
          ? new BigNumber(0)
          : new BigNumber(validator.locked_owner_stake_unit_vault.balance)
              .multipliedBy(totalStakeInXRD)
              .dividedBy(totalStakeUnits)
      }

      const apy = withUptime
        ? new BigNumber(YEARLY_XRD_EMISSIONS)
            .multipliedBy((1 - state.validator_fee_factor) * uptimes[i].alltime)
            .dividedBy(totalAmountStaked)
            .toNumber()
        : 0

      return {
        type: 'validator' as const,
        address: validator.address,
        fee: (state.validator_fee_factor || 0) * 100,
        percentageTotalStake: validator.active_in_epoch?.stake_percentage || 0,

        stakeUnitResourceAddress,
        unstakeClaimResourceAddress:
          state.claim_token_resource_address as string,

        totalStakeUnits,

        totalStakeInXRD,

        metadata: transformMetadata(validator, [
          'name',
          'icon_url',
          'description',
          'tags',
          'info_url'
        ]),

        uptimePercentages: uptimes[i],
        ownerAddress: owners.find(
          (owner) =>
            owner.vaultAddress ===
            ownerVaultAddresses.find(
              ({ non_fungible_id }) => non_fungible_id === ownerBadgeIds[i]
            )?.owning_vault_address
        )?.owner,

        ownerStake,

        percentageOwnerStake:
          validator.stake_vault.balance === '0'
            ? 0
            : new BigNumber(ownerStake)
                .dividedBy(new BigNumber(validator.stake_vault.balance))
                .multipliedBy(100)
                .toNumber(),

        apy,
        acceptsStake: state.accepts_delegated_stake
      }
    })

    return {
      validators,
      ledger_state
    }
  }

export const getValidators = (
  validatorOwnerBadge?: string,
  withStakeUnits = true,
  withUptime = true
) =>
  getValidatorsListWithLedgerState().then(
    transformValidatorResponse(validatorOwnerBadge, withStakeUnits, withUptime)
  )
