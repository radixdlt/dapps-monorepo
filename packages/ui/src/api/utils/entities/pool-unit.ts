import BigNumber from 'bignumber.js'
import type { _Entity } from '.'
import { getMetadataItem, transformMetadata } from '../metadata'
import { getEntityDetails, getSingleEntityDetails } from '@api/gateway'
import { transformPool } from './pool'
import { transformFungibleResource, type FungibleResource } from './resource'

export type PoolUnit = Omit<FungibleResource, 'type'> &
  _Entity<'poolUnit', ['pool']>

const resourceToPoolUnit = (resource: FungibleResource): PoolUnit => ({
  ...resource,
  type: 'poolUnit',
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
        ['pool']
      ).standard
    }
  }
})

export const isPoolUnit = (resource: FungibleResource) =>
  !!getMetadataItem('pool')({ items: resource.metadata.all })

export const getPoolUnits = (resources: FungibleResource[]) =>
  resources.filter(isPoolUnit).map(resourceToPoolUnit)

export const getPoolUnitData = async (
  poolUnit: PoolUnit
): Promise<
  | {
      poolUnit: {
        name?: string
        icon?: URL
        address: string
      }
      poolTokens: {
        name?: string
        icon?: URL
        amount: BigNumber
      }[]
    }
  | undefined
> => {
  const poolAddress = poolUnit.metadata.standard.pool?.value

  if (!poolAddress) return

  const poolEntityDetails = await getSingleEntityDetails(poolAddress)
  const pool = transformPool(poolEntityDetails)

  if (!pool.metadata.standard.pool_unit) return

  const poolResources = await getEntityDetails(
    pool.metadata.standard.pool_resources?.value || []
  ).then((resources) =>
    resources.map((resource, index) =>
      transformFungibleResource(
        resource,
        poolEntityDetails.fungible_resources.items[index]
      )
    )
  )

  return {
    poolUnit: {
      address: poolUnit.address,
      name: poolUnit.metadata.standard.name?.value,
      icon: poolUnit.metadata.standard.icon_url?.value
    },
    poolTokens: poolResources.map((resource) => ({
      name: resource.metadata.standard.name?.value,
      icon: resource.metadata.standard.icon_url?.value,
      amount: new BigNumber(resource.value)
    }))
  }
}
