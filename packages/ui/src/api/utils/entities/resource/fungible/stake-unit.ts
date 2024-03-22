import { callApi } from '@api/_deprecated/gateway'
import type { _Entity } from '../..'
import {
  getStringMetadata,
  transformMetadata,
  createSystemMetadata
} from '../../../metadata'
import type { StateEntityDetailsVaultResponseItem } from '@common/gateway-sdk'
import type { FungibleResource } from '.'
import { ok } from 'neverthrow'
import { getValidatorMetadataValue } from '../../component/validator'
import { getPoolUnitMetadataValue } from './pool-unit'

const systemMetadata = createSystemMetadata({
  validator: 'GlobalAddress'
})

export type StakeUnit = Omit<FungibleResource, 'type'> &
  _Entity<'stakeUnit', typeof systemMetadata>

export const resourceToStakeUnit = (resource: FungibleResource): StakeUnit => {
  const expected = transformMetadata(
    {
      metadata: {
        items: resource.metadata.all
      }
    },
    systemMetadata
  ).expected
  return {
    ...resource,
    type: 'stakeUnit',
    metadata: {
      ...resource.metadata,
      standard: {
        ...resource.metadata.expected,
        ...expected
      },
      expected
    } as any // svelte-check complains otherwise
  }
}

export const isStakeUnit = async (
  entity: StateEntityDetailsVaultResponseItem
) => {
  const validator = await getStringMetadata('validator')(entity.metadata)
  if (!validator) return false
  const validatorEntityResult = await callApi(
    'getEntityDetailsVaultAggregated',
    [validator]
  )
  return validatorEntityResult.match(
    (validatorEntity) =>
      !!getStringMetadata('pool_unit')(validatorEntity[0].metadata),
    () => false
  )
}

const getEntityDetails = (address: string) =>
  callApi('getEntityDetailsVaultAggregated', [address])

export const verifyStakeUnit = async (
  entity: StateEntityDetailsVaultResponseItem
) => {
  const validatorMetadataValue = getValidatorMetadataValue(entity)
  if (!validatorMetadataValue) return false
  const result = await ok(validatorMetadataValue)
    .asyncAndThen(getEntityDetails)
    .map(([entity]) => getPoolUnitMetadataValue(entity))
    .map((poolUnit) => poolUnit === entity.address)

  return result.isOk() && result.value === true
}
