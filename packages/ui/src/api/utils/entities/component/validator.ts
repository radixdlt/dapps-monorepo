import type {
  ErrorResponse,
  LedgerState,
  StateEntityDetailsResponseFungibleResourceDetails,
  StateEntityDetailsVaultResponseItem,
  ValidatorCollectionItem,
  ValidatorUptimeCollectionItem
} from '@common/gateway-sdk'
import {
  getEnumStringMetadata,
  transformMetadata,
  createSystemMetadata,
  createStandardMetadata
} from '../../metadata'
import { type _Entity } from '..'
import {
  callApi,
  getEntityDetails,
  getNonFungibleLocation
} from '@api/_deprecated/gateway'
import BigNumber from 'bignumber.js'
import { andThen, isNil, map, pick, pipe, prop, reject } from 'ramda'
import { timeToEpoch } from '@utils'
import { ResultAsync } from 'neverthrow'
import {
  transformComponent,
  type Component,
  type EntityType,
  standardMetadata as componentStandardMetadata
} from '.'

const systemMetadata = createSystemMetadata({
  owner_badge: 'NonFungibleGlobalId',
  pool_unit: 'GlobalAddress',
  claim_nft: 'NonFungibleGlobalId'
})

const standardMetadata = {
  ...createStandardMetadata({
    icon_url: 'Url',
    info_url: 'Url'
  }),
  ...componentStandardMetadata
}

type ComponentState = {
  public_key: {
    key_hex: string
    key_type: 'EcdsaSecp256k1' | 'EddsaEd25519'
  }
  sorted_key: {
    key_hex: string
    key_type: 'Map' | 'Sorted'
    db_sort_key_hex: string
    sort_prefix_hex: string
  }
  is_registered: boolean
  stake_xrd_vault: {
    is_global: boolean
    entity_type: EntityType
    entity_address: string
  }
  validator_fee_factor: string
  accepts_delegated_stake: boolean
  pending_xrd_withdraw_vault: {
    is_global: boolean
    entity_type: EntityType
    entity_address: string
  }
  stake_unit_resource_address: string
  claim_token_resource_address: string
  validator_fee_change_request: {
    epoch_effective: number
    new_fee_factor: string
  } | null
  locked_owner_stake_unit_vault: {
    is_global: boolean
    entity_type: EntityType
    entity_address: string
  }
  pending_owner_stake_unit_withdrawals: {
    epoch_unlocked: number
    stake_unit_amount: string
  }[]
  pending_owner_stake_unit_unlock_vault: {
    is_global: boolean
    entity_type: EntityType
    entity_address: string
  }
  already_unlocked_owner_stake_unit_amount: string
}

export type Validator = Component<ComponentState, typeof standardMetadata> & {
  fee: (current_epoch: number) => {
    percentage: number
    tooltip?: string
  }
  acceptsStake: boolean
  stakeUnitResourceAddress: string
  unstakeClaimResourceAddress: string
}

export type ValidatorListItem<WithOwner = false, WithStakeUnits = false> = {
  address: string
  totalStakeInXRD: BigNumber
  fee: (current_epoch: number) => {
    percentage: number
    tooltip?: string
  }
  metadata: Validator['metadata']
  acceptsStake: boolean
  percentageTotalStake: number
  stakeUnitResourceAddress: string
  unstakeClaimResourceAddress: string
  isRegistered: boolean
  rank: number
  validator: ValidatorCollectionItem
} & (WithOwner extends true ? { ownerAddress: string | undefined } : {}) &
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

export type UptimeValue =
  | '1day'
  | '1week'
  | '1month'
  | '3months'
  | '6months'
  | '1year'
  | 'alltime'

export const uptimePeriodDefinition: Record<
  UptimeValue,
  { label: string; getStartingPoint: () => Date | number; default?: boolean }
> = {
  '1day': {
    label: '1 Day',
    getStartingPoint: () => new Date(Date.now() - ONE_DAY_MS)
  },
  '1week': {
    label: '1 Week',
    getStartingPoint: () => new Date(Date.now() - ONE_DAY_MS * 7)
  },
  '1month': {
    default: true,
    label: '1 Month',
    getStartingPoint: () => new Date(Date.now() - ONE_DAY_MS * 30)
  },
  '3months': {
    label: '3 Months',
    getStartingPoint: () => new Date(Date.now() - ONE_DAY_MS * 90)
  },
  '6months': {
    label: '6 Months',
    getStartingPoint: () => new Date(Date.now() - ONE_DAY_MS * 180)
  },
  '1year': {
    label: '1 Year',
    getStartingPoint: () => new Date(Date.now() - ONE_DAY_MS * 365)
  },
  alltime: {
    label: 'All Time',
    getStartingPoint: () => 1 // epoch "1" is starting point for all time calculation
  }
}

export const uptimeUiOptions = Object.entries(uptimePeriodDefinition).map(
  ([key, value]) => ({
    label: value.label,
    value: key as UptimeValue,
    default: value.default
  })
)

export const dateMsAgo = (ms: number) => new Date(Date.now() - ms)

export const getValidatorUptimeSinceDate =
  (addresses: string[]) => (timestamp: Date | number) =>
    callApi('getValidatorsUptimeFromTo', addresses, timestamp).map((uptimes) =>
      uptimes.reduce((acc, cur) => {
        acc[cur.address] = calculateUptimePercentage(cur)
        return acc
      }, {} as Record<string, number | undefined>)
    )

export const calculateUptimePercentage = ({
  proposals_made,
  proposals_missed,
  epochs_active_in
}: ValidatorUptimeCollectionItem) => {
  if (epochs_active_in === 0) return undefined
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

export const getUptimePercentages = (validators: ValidatorCollectionItem[]) =>
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

const calculateFee = (state: ComponentState) => (current_epoch: number) => {
  const change_request = state.validator_fee_change_request as
    | { epoch_effective: number; new_fee_factor: string }
    | undefined

  const proportionToPercentage = (proportion: string) =>
    parseFloat(proportion) * 100

  if (!change_request) {
    // There is no fee change request, so the current fee factor is correct
    return {
      percentage: proportionToPercentage(state.validator_fee_factor || '0')
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
  <WithOwner extends string | undefined, WithStakeUnits extends boolean>(
    validatorOwnerBadgeResource: WithOwner,
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
      validators: ValidatorListItem<
        WithOwner extends string ? true : false,
        WithStakeUnits
      >[]
      ledger_state: LedgerState
    },
    ErrorResponse
  > =>
    ResultAsync.fromPromise(
      (async () => {
        const validators = await transformValidators(aggregatedEntities)

        let returnedValidators = [...validators]

        if (withStakeUnits)
          returnedValidators = await appendStakeUnits(
            validators,
            ledger_state
          )(aggregatedEntities)

        if (validatorOwnerBadgeResource) {
          returnedValidators = await appendOwner(
            returnedValidators,
            validatorOwnerBadgeResource
          )(aggregatedEntities)
        }

        return {
          validators: returnedValidators as ValidatorListItem<
            WithOwner extends string ? true : false,
            WithStakeUnits
          >[],
          ledger_state
        }
      })(),
      (e) => e as ErrorResponse
    )

export const transformValidator = (
  entity: StateEntityDetailsVaultResponseItem
): Validator =>
  pipe(
    () =>
      transformComponent<
        ComponentState,
        typeof standardMetadata & typeof systemMetadata
      >(entity, {
        ...standardMetadata,
        ...systemMetadata
      }),
    (entity) => ({
      ...entity,
      componentType: 'validator' as const,
      fee: calculateFee(entity.state),
      stakeUnitResourceAddress: entity.state.stake_unit_resource_address,
      unstakeClaimResourceAddress: entity.state.claim_token_resource_address,
      acceptsStake: entity.state.accepts_delegated_stake
    })
  )()

export const transformValidatorListItem = (
  validator: ValidatorCollectionItem
) => {
  const state = validator.state as ComponentState

  return {
    address: validator.address,
    metadata: transformMetadata(validator, standardMetadata, systemMetadata),
    fee: calculateFee(state),
    percentageTotalStake: validator.active_in_epoch?.stake_percentage || 0,
    stakeUnitResourceAddress: state.stake_unit_resource_address,
    unstakeClaimResourceAddress: state.claim_token_resource_address,
    totalStakeInXRD: new BigNumber(validator.stake_vault.balance),
    acceptsStake: state.accepts_delegated_stake,
    isRegistered: state.is_registered,
    validator
  }
}

const transformValidators = (
  aggregatedEntities: ValidatorCollectionItem[]
): ValidatorListItem[] =>
  aggregatedEntities
    .sort((v1, v2) =>
      new BigNumber(v2.stake_vault.balance).comparedTo(
        new BigNumber(v1.stake_vault.balance)
      )
    )
    .map((validator, i) => ({
      ...transformValidatorListItem(validator),
      rank: i + 1
    }))

const appendStakeUnits =
  <T, K>(validators: ValidatorListItem<T, K>[], ledger_state: LedgerState) =>
  async (
    entities: ValidatorCollectionItem[]
  ): Promise<ValidatorListItem<T, true>[]> => {
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
  <K>(
    validators: ValidatorListItem<false, K>[],
    validatorOwnerBadgeResource: string
  ) =>
  async (
    entities: ValidatorCollectionItem[]
  ): Promise<ValidatorListItem<true, K>[]> => {
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
  WithStakeUnits extends boolean
>(
  validatorOwnerBadge: WithOwner,

  withStakeUnits: WithStakeUnits
) =>
  callApi('getAllValidatorsWithLedgerState').andThen(
    transformValidatorResponse<WithOwner, WithStakeUnits>(
      validatorOwnerBadge,
      withStakeUnits
    )
  )
