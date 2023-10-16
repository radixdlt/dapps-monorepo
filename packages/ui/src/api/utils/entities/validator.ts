import type {
  LedgerState,
  StateEntityDetailsResponseFungibleResourceDetails,
  ValidatorCollectionItem,
  ValidatorUptimeCollectionItem
} from '@common/gateway-sdk'
import { getEnumStringMetadata, transformMetadata } from '../metadata'
import type { _Entity } from '.'
import {
  callApi,
  getEntityDetails,
  getNonFungibleLocation,
  type GatewayError
} from '@api/gateway'
import BigNumber from 'bignumber.js'
import { andThen, isNil, map, pick, pipe, prop, reduce, reject } from 'ramda'
import { YEARLY_XRD_EMISSIONS } from '@constants'
import { timeToEpoch } from '@utils'
import { Result, ResultAsync, errAsync, okAsync } from 'neverthrow'

export type Validator<
  WithOwner = false,
  WithUptime = false,
  WithStakeUnits = false
> = _Entity<'validator', ['name', 'icon_url', 'description', 'info_url']> & {
  totalStakeInXRD: BigNumber
  fee: {
    percentage: number
    tooltip?: string
  }
  acceptsStake: boolean
  percentageTotalStake: number
  stakeUnitResourceAddress: string
  unstakeClaimResourceAddress: string
  rank: number
} & (WithOwner extends true ? { ownerAddress: string | undefined } : {}) &
  (WithUptime extends true
    ? {
        uptimePercentages: {
          '1day': number
          '1week': number
          '1month': number
          '3months': number
          '6months': number
          '1year': number
          alltime: number
        }
        apy: number
      }
    : {}) &
  (WithStakeUnits extends true
    ? {
        totalStakeUnits: BigNumber
        ownerStake: BigNumber
      }
    : {})

const ONE_DAY_MS = 1000 * 60 * 60 * 24
const ONE_WEEK_MS = ONE_DAY_MS * 7
const ONE_MONTH_MS = ONE_DAY_MS * 30
const THREE_MONTHS_MS = ONE_DAY_MS * 90
const SIX_MONTHS_MS = ONE_DAY_MS * 180
const ONE_YEAR_MS = ONE_DAY_MS * 365

const dateMsAgo = (ms: number) => new Date(Date.now() - ms)

const getValidatorUptimeSinceDate =
  (addresses: string[]) => (timestamp: Date | number) =>
    callApi('getValidatorsUptimeFromTo', addresses, timestamp).map((uptimes) =>
      uptimes.reduce((acc, cur) => {
        acc[cur.address] = calculateUptimePercentage(cur)
        return acc
      }, {} as Record<string, number>)
    )

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
    (results) => ResultAsync.combine(results),
    (result) =>
      result.map((uptimes) =>
        validators.map(({ address }) => ({
          address: address,
          uptimes: {
            '1day': uptimes[0][address],
            '1week': uptimes[1][address],
            '1month': uptimes[2][address],
            '3months': uptimes[3][address],
            '6months': uptimes[4][address],
            '1year': uptimes[5][address],
            alltime: uptimes[6][address]
          }
        }))
      )
  )()

function calculateFee(
  validator: ValidatorCollectionItem,
  current_epoch: number
) {
  const state = validator.state as any
  const change_request = state.validator_fee_change_request as
    | { epoch_effective: number; new_fee_factor: string }
    | undefined

  const proportionToPercentage = (proportion: string) =>
    parseFloat(proportion) * 100

  if (!change_request) {
    // There is no fee change request, so the current fee factor is correct
    return {
      percentage: proportionToPercentage(state.validator_fee_factor || 0)
    }
  }
  if (current_epoch >= change_request.epoch_effective) {
    // The pending fee change request is now effective
    return {
      percentage: proportionToPercentage(change_request.new_fee_factor)
    }
  }
  // Otherwise - the fee change request is pending.
  // We display the _new/pending_ fee factor in this case, colour the fee factor in, and show a tooltip explaining the current/old factor.
  return {
    percentage: proportionToPercentage(change_request.new_fee_factor),
    toolTip: `This validator's fee is currently ${proportionToPercentage(
      state.validator_fee_factor
    )}%. The value shown will take effect in ${timeToEpoch(
      current_epoch,
      change_request.epoch_effective
    )}.`
  }
}

export const transformValidatorResponse =
  <
    WithOwner extends string | undefined,
    WithUptime extends boolean,
    WithStakeUnits extends boolean
  >(
    validatorOwnerBadgeResource: WithOwner,
    withUptime: WithUptime,
    withStakeUnits: WithStakeUnits
  ) =>
  ({
    aggregatedEntities,
    ledger_state
  }: {
    aggregatedEntities: ValidatorCollectionItem[]
    ledger_state: LedgerState
  }): ResultAsync<
    {
      validators: Validator<
        WithOwner extends string ? true : false,
        WithUptime,
        WithStakeUnits
      >[]
      ledger_state: LedgerState
    },
    GatewayError
  > =>
    ResultAsync.fromPromise(
      (async () => {
        const validators = await transformValidators(
          aggregatedEntities,
          ledger_state
        )

        let returnedValidators = [...validators]

        if (withStakeUnits)
          returnedValidators = await appendStakeUnits(
            validators,
            ledger_state
          )(aggregatedEntities)

        if (withUptime) {
          const result = await appendUptime(returnedValidators)(
            aggregatedEntities
          )

          if (result.isErr()) throw result.error

          returnedValidators = result.value
        }

        if (validatorOwnerBadgeResource) {
          returnedValidators = await appendOwner(
            returnedValidators,
            validatorOwnerBadgeResource
          )(aggregatedEntities)
        }

        return {
          validators: returnedValidators as Validator<
            WithOwner extends string ? true : false,
            WithUptime,
            WithStakeUnits
          >[],
          ledger_state
        }
      })(),
      (e) => e as GatewayError
    )

const transformValidators = async (
  aggregatedEntities: ValidatorCollectionItem[],
  ledger_state: LedgerState
): Promise<Validator[]> => {
  return aggregatedEntities
    .sort((v1, v2) =>
      new BigNumber(v2.stake_vault.balance).comparedTo(
        new BigNumber(v1.stake_vault.balance)
      )
    )
    .map((validator, i) => {
      const state: any = validator.state || {}

      const stakeUnitResourceAddress =
        state.stake_unit_resource_address as string

      const totalStakeInXRD = new BigNumber(validator.stake_vault.balance)

      return {
        type: 'validator' as const,
        address: validator.address,
        fee: calculateFee(validator, ledger_state.epoch),
        percentageTotalStake: validator.active_in_epoch?.stake_percentage || 0,
        stakeUnitResourceAddress,
        unstakeClaimResourceAddress:
          state.claim_token_resource_address as string,
        totalStakeInXRD,
        metadata: transformMetadata(validator, [
          'name',
          'icon_url',
          'description',
          'tags',
          'info_url'
        ]),
        rank: i + 1,
        acceptsStake: state.accepts_delegated_stake
      }
    })
}

const appendUptime =
  <T, K>(validators: Validator<T, false, K>[]) =>
  async (
    entities: ValidatorCollectionItem[]
  ): Promise<Result<Validator<T, true, K>[], GatewayError>> => {
    const result = await getUptimePercentages(entities)

    if (result.isErr()) return errAsync(result.error)

    const uptimes = result.value

    const totalAmountStaked = pipe(
      () => entities,
      reduce(
        (prev, cur) => prev.plus(cur.stake_vault.balance),
        new BigNumber(0)
      )
    )()

    return okAsync(
      validators.map((validator, i) => {
        const { uptimes: _uptimes } = uptimes.find(
          (u) => u.address === validator.address
        )!
        const entity = entities.find((e) => e.address === validator.address)!

        return {
          ...validator,
          uptimePercentages: _uptimes,
          apy: new BigNumber(YEARLY_XRD_EMISSIONS)
            .multipliedBy(
              (1 - (entity.state as any).validator_fee_factor) *
                _uptimes.alltime
            )
            .dividedBy(totalAmountStaked)
            .toNumber()
        }
      })
    )
  }

const appendStakeUnits =
  <T, K>(validators: Validator<T, K>[], ledger_state: LedgerState) =>
  async (
    entities: ValidatorCollectionItem[]
  ): Promise<Validator<T, K, true>[]> => {
    const stakeUnits = await getEntityDetails(
      validators.map((v) => v.stakeUnitResourceAddress),
      undefined,
      { state_version: ledger_state.state_version }
    )

    return validators.map((validator) => {
      const entity = entities.find((e) => e.address === validator.address)!

      const stakeUnitResourceAddress = (entity.state as any)
        .stake_unit_resource_address as string

      const totalStakeUnits = new BigNumber(
        (
          stakeUnits.find((s) => s.address === stakeUnitResourceAddress)!
            .details as StateEntityDetailsResponseFungibleResourceDetails
        ).total_supply
      )

      const ownerStake = totalStakeUnits.isZero()
        ? new BigNumber(0)
        : new BigNumber(entity.locked_owner_stake_unit_vault.balance)
            .multipliedBy(validator.totalStakeInXRD)
            .dividedBy(totalStakeUnits)

      return {
        ...validator,
        totalStakeUnits,
        ownerStake
      }
    })
  }

const appendOwner =
  <T, K>(
    validators: Validator<false, T, K>[],
    validatorOwnerBadgeResource: string
  ) =>
  async (
    entities: ValidatorCollectionItem[]
  ): Promise<Validator<true, T, K>[]> => {
    const ownerBadgeIds = entities.map((entity) =>
      getEnumStringMetadata('owner_badge')(entity.metadata)
    )

    const ownerData = await getNonFungibleLocation(
      validatorOwnerBadgeResource,
      ownerBadgeIds
    )

    const ownerVaultAddresses = pipe(
      () => ownerData,
      map(pick(['owning_vault_address', 'non_fungible_id']))
    )()

    const owners = await pipe(
      () =>
        getEntityDetails(
          pipe(
            () => ownerVaultAddresses,
            map(prop('owning_vault_address')),
            (address) => reject(isNil, address)
          )(),
          { ancestorIdentities: true }
        ),
      andThen(
        map((detail) => ({
          owner: detail.ancestor_identities?.owner_address,
          vaultAddress: detail.address
        }))
      )
    )()

    return validators.map((validator, i) => ({
      ...validator,
      ownerAddress: owners.find(
        (owner) =>
          owner.vaultAddress ===
          ownerVaultAddresses.find(
            ({ non_fungible_id }) => non_fungible_id === ownerBadgeIds[i]
          )?.owning_vault_address
      )?.owner
    }))
  }

export const getValidators = <
  WithOwner extends string | undefined,
  WithUptime extends boolean,
  WithStakeUnits extends boolean
>(
  validatorOwnerBadge: WithOwner,
  withUptime: WithUptime,
  withStakeUnits: WithStakeUnits
) =>
  callApi('getAllValidatorsWithLedgerState').andThen(
    transformValidatorResponse<WithOwner, WithUptime, WithStakeUnits>(
      validatorOwnerBadge,
      withUptime,
      withStakeUnits
    )
  )
