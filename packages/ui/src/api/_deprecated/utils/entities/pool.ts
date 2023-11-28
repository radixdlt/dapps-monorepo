import type { StateEntityDetailsVaultResponseItem } from '@common/gateway-sdk'
import { transformEntity, type _Entity } from '.'
import BigNumber from 'bignumber.js'
import type { FungibleResource } from './resource'
import type { PoolUnit } from './pool-unit'
import { pipe } from 'ramda'

export type Pool = _Entity<
  'pool',
  ['owner_badge', 'pool_vault_number', 'pool_resources', 'pool_unit']
> & { entity: StateEntityDetailsVaultResponseItem }

export const transformPool = pipe(
  transformEntity([
    'owner_badge',
    'pool_vault_number',
    'pool_resources',
    'pool_unit',
    'tags'
  ]),
  (entity) => ({
    ...entity,
    type: 'pool' as const
  })
)

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
