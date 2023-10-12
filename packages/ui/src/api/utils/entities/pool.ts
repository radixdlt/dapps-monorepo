import type { StateEntityDetailsVaultResponseItem } from '@common/gateway-sdk'
import type { _Entity } from '.'
import { transformMetadata } from '../metadata'
import BigNumber from 'bignumber.js'
import type { FungibleResource } from './resource'
import type { PoolUnit } from './pool-unit'

export type Pool = _Entity<
  'pool',
  ['owner_badge', 'pool_vault_number', 'pool_resources', 'pool_unit']
> & { entity: StateEntityDetailsVaultResponseItem }

export const transformPool = (
  poolEntity: StateEntityDetailsVaultResponseItem
): Pool => ({
  type: 'pool',
  address: poolEntity.address,
  entity: poolEntity,
  metadata: transformMetadata(poolEntity, [
    'owner_badge',
    'pool_vault_number',
    'pool_resources',
    'pool_unit',
    'tags'
  ])
})

export const getRedeemablePoolTokenAmount = (
  poolToken: FungibleResource,
  poolUnitResource: PoolUnit
) => {
  const poolUnitsBalance = poolUnitResource.value
  const poolVaultBalance = poolToken.value
  const totalSupplyOfPoolUnits = poolUnitResource.totalSupply

  return new BigNumber(
    new BigNumber(poolUnitsBalance)
      .multipliedBy(poolVaultBalance)
      .dividedBy(totalSupplyOfPoolUnits)
      .toFixed(poolToken.divisibility)
  )
}
