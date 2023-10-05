import { callApi } from '@api/gateway'
import type { _Entity } from '.'
import { getStringMetadata, transformMetadata } from '../metadata'
import type { FungibleResource } from './resource'
import type { StateEntityDetailsVaultResponseItem } from '@common/gateway-sdk'

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
