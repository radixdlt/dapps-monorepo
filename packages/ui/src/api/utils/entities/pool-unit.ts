import BigNumber from 'bignumber.js'
import type { _Entity } from '.'
import { getMetadataItem, transformMetadata } from '../metadata'
import {
  callApi,
  getEntityDetails,
  getSingleEntityDetails,
  type GatewayError
} from '@api/gateway'
import { transformPool, type Pool } from './pool'
import { transformFungibleResource, type FungibleResource } from './resource'
import { Result, err, errAsync, ok, okAsync } from 'neverthrow'
import { pipe } from 'ramda'

export type PoolUnit = Omit<FungibleResource, 'type'> &
  _Entity<'poolUnit', ['pool']>

export const resourceToPoolUnit = (resource: FungibleResource): PoolUnit => ({
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

export const getPoolUnitData = (poolUnit: PoolUnit) =>
  pipe(
    () => poolUnit.metadata.standard.pool?.value,
    (poolAddress) =>
      !poolAddress
        ? errAsync({ message: 'Pool not found.' } as GatewayError)
        : callApi('getEntityDetailsVaultAggregated', [poolAddress]).map(
            (entities) => entities[0]
          ),
    (result) =>
      result.andThen((poolEntity) =>
        pipe(
          () => transformPool(poolEntity),
          (pool) =>
            pool.metadata.standard.pool_unit
              ? ok(pool)
              : err({ message: 'Pool unit not found.' } as GatewayError),
          (result: Result<Pool, GatewayError>) =>
            result.asyncAndThen((pool) =>
              callApi(
                'getEntityDetailsVaultAggregated',
                pool.metadata.standard.pool_resources?.value || []
              )
            ),
          (result) =>
            result.map((resources) =>
              resources.map((resource, index) =>
                transformFungibleResource(
                  resource,
                  poolEntity.fungible_resources.items[index]
                )
              )
            )
        )()
      ),
    (result) =>
      result.andThen((poolResources) =>
        okAsync({
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
        })
      )
  )()
