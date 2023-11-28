import type { StateEntityDetailsVaultResponseItem } from '@common/gateway-sdk'
import BigNumber from 'bignumber.js'
import type { PoolUnit } from '../resource/fungible/pool-unit'
import { pipe } from 'ramda'
import type { FungibleResource } from '../resource/fungible'
import type { Account } from './account'
import type { MetadataTypeToNativeType } from '../../metadata'
import {
  transformComponent,
  type Component,
  type StandardMetadata,
  type EntityType
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

type SystemMetadata = {
  owner_badge: MetadataTypeToNativeType['String']
  pool_vault_number: MetadataTypeToNativeType['String']
  pool_resources: MetadataTypeToNativeType['StringArray']
  pool_unit: MetadataTypeToNativeType['String']
}

export type Pool = Component<
  ComponentState,
  StandardMetadata & SystemMetadata
> & {
  componentType: 'pool'
}

export const transformPool = (
  entity: StateEntityDetailsVaultResponseItem
): Pool =>
  pipe(
    () =>
      transformComponent<ComponentState, StandardMetadata & SystemMetadata>(
        entity,
        ['owner_badge', 'pool_vault_number', 'pool_resources', 'pool_unit']
      ),
    (entity) => ({
      ...entity,
      componentType: 'pool' as const
    })
  )()

export const getRedeemablePoolTokenAmount = (
  poolToken: FungibleResource,
  poolUnitResource: PoolUnit,
  account: Account
) => {
  const poolUnitsBalance = account.resources.fungible.find(
    (resource) => resource.address === poolUnitResource.address
  )!.value

  const poolVaultBalance = account.resources.fungible.find(
    (resource) => resource.address === poolToken.address
  )!.value

  const totalSupplyOfPoolUnits = poolUnitResource.totalSupply

  return new BigNumber(
    new BigNumber(poolUnitsBalance)
      .multipliedBy(poolVaultBalance)
      .dividedBy(totalSupplyOfPoolUnits)
      .toFixed(poolToken.divisibility)
  )
}
