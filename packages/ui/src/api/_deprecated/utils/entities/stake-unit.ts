import { callApi } from '@api/_deprecated/gateway'
import type { _Entity } from '.'
import { getStringMetadata, transformMetadata } from '../metadata'
import type { FungibleResource } from './resource'
import type { StateEntityDetailsVaultResponseItem } from '@common/gateway-sdk'
import { ok } from 'neverthrow'

export type StakeUnit = Omit<FungibleResource, 'type'> &
  _Entity<'stakeUnit', ['name', 'description', 'icon_url', 'validator']>

export const resourceToStakeUnit = (resource: FungibleResource): StakeUnit => ({
  ...resource,
  type: 'stakeUnit',
  metadata: {
    ...resource.metadata,
    standard: {
      ...resource.metadata.standard,
      ...transformMetadata(
        {
          metadata: {
            items: resource.metadata.all
          }
        },
        ['name', 'description', 'icon_url', 'validator']
      ).standard
    }
  } as any // svelte-check complains otherwise
})

const getEntityDetails = (address: string) =>
  callApi('getEntityDetailsVaultAggregated', [address])

const getValidatorMetadataValue = (
  entity: StateEntityDetailsVaultResponseItem
) => getStringMetadata('validator')(entity.metadata)

const getPoolUnitMetadataValue = (
  entity: StateEntityDetailsVaultResponseItem
) => getStringMetadata('poolUnit')(entity.metadata)

export const verifyStakeUnit = async (
  entity: StateEntityDetailsVaultResponseItem
) => {
  const result = await ok(getValidatorMetadataValue(entity))
    .asyncAndThen(getEntityDetails)
    .map(([entity]) => getPoolUnitMetadataValue(entity))
    .map((poolUnit) => poolUnit === entity.address)

  return result.isOk()
}

export const hasValidatorMetadataSet = (
  entity: StateEntityDetailsVaultResponseItem
) => {
  const validatorAddress = getValidatorMetadataValue(entity)
  const isValidatorAddress = validatorAddress.startsWith('validator_')

  return isValidatorAddress
}
