import type {
  ErrorResponse,
  LedgerState,
  StateEntityDetailsResponseFungibleResourceDetails,
  ValidatorCollectionItem
} from '@common/gateway-sdk'
import { transformMetadata } from '../metadata'
import type { _Entity } from '.'
import {
  callApi,
  getEntityDetails,
  getNonFungibleLocation
} from '@api/_deprecated/gateway'
import BigNumber from 'bignumber.js'
import { andThen, isNil, map, pick, pipe, prop, reduce, reject } from 'ramda'
import { YEARLY_XRD_EMISSIONS } from '@constants'
import { timeToEpoch } from '@utils'
import { Result, ResultAsync, errAsync, okAsync } from 'neverthrow'
import { getEnumStringMetadata } from '@api/utils/metadata'
import { getUptimePercentages } from '@api/utils/entities/component/validator'

export type Validator<
  WithOwner = false,
  WithUptime = false,
  WithStakeUnits = false
> = _Entity<
  'validator',
  ['name', 'icon_url', 'description', 'info_url'],
  false
> & {
  totalStakeInXRD: BigNumber
  fee: {
    percentage: number
    tooltip?: string
  }
  acceptsStake: boolean
  percentageTotalStake: number
  stakeUnitResourceAddress: string
  unstakeClaimResourceAddress: string
  isRegistered: boolean
} & (WithOwner extends true ? { ownerAddress: string | undefined } : {}) &
  (WithUptime extends true
    ? {
        uptimePercentages: {
          '1day'?: number
          '1week'?: number
          '1month'?: number
          '3months'?: number
          '6months'?: number
          '1year'?: number
          alltime?: number
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
    ErrorResponse
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
      (e) => e as ErrorResponse
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
    .map((validator) => {
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
        acceptsStake: state.accepts_delegated_stake,
        isRegistered: state.is_registered
      }
    })
}

const appendUptime =
  <T, K>(validators: Validator<T, false, K>[]) =>
  async (
    entities: ValidatorCollectionItem[]
  ): Promise<Result<Validator<T, true, K>[], ErrorResponse>> => {
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
        const fee = validator.fee.percentage / 100
        return {
          ...validator,
          uptimePercentages: _uptimes,
          apy: new BigNumber(YEARLY_XRD_EMISSIONS)
            .multipliedBy((1 - fee) * (_uptimes.alltime ?? 0))
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
