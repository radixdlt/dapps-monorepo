import { andThen, otherwise, pipe } from 'ramda'
import type { _Entity } from '.'
import { getStringMetadata, transformMetadata } from '../metadata'
import type { FungibleResource } from './resource'
import { getSingleEntityDetails } from '@api/gateway'
import type { StateEntityDetailsVaultResponseItem } from '@radixdlt/babylon-gateway-api-sdk'

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

export const isStakeUnit = async (address: string) => {
  const entity = await getSingleEntityDetails(address)
  const validator = await getStringMetadata('validator')(entity.metadata)

  if (!validator) return false

  let validatorEntity: StateEntityDetailsVaultResponseItem

  try {
    validatorEntity = await getSingleEntityDetails(validator)
  } catch {
    return false
  }

  return !!getStringMetadata('pool_unit')(validatorEntity.metadata)
}
