import type { _Entity } from '../..'
import { transformMetadata, createSystemMetadata } from '../../../metadata'
import type { StateEntityDetailsVaultResponseItem } from '@common/gateway-sdk'
import type { FungibleResource } from '.'

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

export const verifyStakeUnit = (entity: StateEntityDetailsVaultResponseItem) =>
  entity.details?.type === 'FungibleResource' &&
  entity.details.native_resource_details?.kind === 'ValidatorLiquidStakeUnit'
