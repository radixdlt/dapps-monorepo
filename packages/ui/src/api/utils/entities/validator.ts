import type { StateEntityDetailsResponseFungibleResourceDetails } from '@radixdlt/babylon-gateway-api-sdk'
import { getEnumStringMetadata, getStandardMetadataEntry } from '../metadata'
import type { _Entity } from '.'
import {
  getEntityDetails,
  getValidatorsListWithLedgerState
} from '@api/gateway'

export type Validator = _Entity<
  [
    ['name', string],
    ['symbol', string],
    ['iconUrl', string],
    ['description', string],
    ['tags', string[]],
    ['website', string]
  ]
> & {
  ownerAddress: string
  totalStakeInXRD: string
  ownerStake: string
  percentageOwnerStake: number
  apy: number
  fee: number
  uptime: number
  acceptsStake: boolean
  percentageTotalStake: number
  stakeUnitResourceAddress: string
  unstakeClaimResourceAddress: string
  totalStakeUnits: string
}

export const transformValidatorResponse = async ({
  aggregatedEntities,
  ledger_state: { state_version }
}: Awaited<ReturnType<typeof getValidatorsListWithLedgerState>>): Promise<
  Validator[]
> => {
  const stakeUnits = await getEntityDetails(
    aggregatedEntities.map(
      (v) => (v.state as any).stake_unit_resource_address as string
    ),
    undefined,
    { state_version }
  )

  return aggregatedEntities.map((validator, i) => {
    const state: any = validator.state || {}

    const stakeUnitResourceAddress = state.stake_unit_resource_address as string

    return {
      address: validator.address,
      fee: (state.validator_fee_factor || 0) * 100,
      percentageTotalStake: validator.active_in_epoch?.stake_percentage || 0,

      stakeUnitResourceAddress,
      unstakeClaimResourceAddress: state.claim_token_resource_address as string,

      totalStakeUnits: (
        stakeUnits[i]
          .details as StateEntityDetailsResponseFungibleResourceDetails
      ).total_supply,
      totalStakeInXRD: validator.stake_vault.balance,

      metadata: {
        standard: {
          name: getStandardMetadataEntry(
            'name',
            getEnumStringMetadata
          )(validator.metadata),
          website: getStandardMetadataEntry(
            'website',
            getEnumStringMetadata
          )(validator.metadata)
        },
        nonStandard: ((validator.metadata?.items as any[]) || []).filter(
          ({ key }) => key !== 'name' && key !== 'url'
        ),
        all: validator.metadata?.items ?? [],
        explicit: []
      },

      uptime: 0,
      ownerAddress: '',
      ownerStake: '0',
      percentageOwnerStake: 0,
      apy: 0,
      acceptsStake: true
    }
  })
}

export const getValidators = () =>
  getValidatorsListWithLedgerState().then(transformValidatorResponse)
