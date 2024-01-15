import type { StateEntityDetailsVaultResponseItem } from '@common/gateway-sdk'
import BigNumber from 'bignumber.js'
import type { PoolUnit } from '../resource/fungible/pool-unit'
import { pipe } from 'ramda'
import type { FungibleResource } from '../resource/fungible'
import type { Account } from './account'
import {
  createSystemMetadata,
  type SystemMetadata as _SystemMetadata
} from '../../metadata'
import {
  transformComponent,
  type Component,
  type EntityType,
  standardMetadata
} from '.'

type ComponentState = {
  vaults: {
    vault: {
      entity_type: EntityType
      is_global: boolean
      entity_address: string
    }
    resource_address: string
  }[]
  pool_unit_resource_address: string
}

const systemMetadata = createSystemMetadata({
  owner_badge: 'NonFungibleLocalId',
  pool_vault_number: 'U8',
  pool_resources: 'GlobalAddressArray',
  pool_unit: 'GlobalAddress'
})

export type Pool = Component<
  ComponentState,
  typeof standardMetadata & typeof systemMetadata
> & {
  componentType: 'pool'
}

export const transformPool = (
  entity: StateEntityDetailsVaultResponseItem
): Pool =>
  pipe(
    () =>
      transformComponent<
        ComponentState,
        typeof standardMetadata & typeof systemMetadata
      >(entity, systemMetadata),
    (entity) => ({
      ...entity,
      componentType: 'pool' as const
    })
  )()

export const getRedeemablePoolTokenAmount = (
  poolToken: FungibleResource,
  poolUnitResource: PoolUnit,
  account: Account,
  pool: Pool
) => {
  const poolUnitsBalance = account.resources.fungible.find(
    (resource) => resource.address === poolUnitResource.address
  )!.value

  const poolVaultBalance = pool.resources.fungible.find(
    (resource) => resource.address === poolToken.address
  )!.value

  const totalSupplyOfPoolUnits = poolUnitResource.totalSupply

  return new BigNumber(
    new BigNumber(poolUnitsBalance)
      .dividedBy(totalSupplyOfPoolUnits)
      .multipliedBy(poolVaultBalance)
      .toFixed(poolToken.divisibility)
  )
}
