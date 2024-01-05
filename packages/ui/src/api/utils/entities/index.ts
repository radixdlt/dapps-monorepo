import BigNumber from 'bignumber.js'
import { getAuthInfo, type AuthInfo } from '../auth'
import {
  transformMetadata,
  type ExpectedMetadata,
  type NarrowedMetadataTypedValue
} from '../metadata'
import type { Component } from './component'
import type { Package } from './package'
import type { Pool } from './component/pool'
import type { PoolUnit } from './resource/fungible/pool-unit'
import type { StakeUnit } from './resource/fungible/stake-unit'
import type { Validator } from './component/validator'
import type {
  EntityMetadataItem,
  FungibleResourcesCollectionItemVaultAggregatedVaultItem,
  NonFungibleResourcesCollectionItemVaultAggregatedVaultItem,
  StateEntityDetailsResponseComponentDetails,
  StateEntityDetailsVaultResponseItem
} from '@common/gateway-sdk'
import { flatten, isNil, map, pipe, reject } from 'ramda'
import type { NonFungibleResource } from './resource/non-fungible'
import type { FungibleResource } from './resource/fungible'

export type Entity =
  | Package
  | Validator
  | FungibleResource
  | NonFungibleResource
  | PoolUnit
  | Pool
  | Component
  | StakeUnit

export type _Entity<
  Type extends string,
  _ExpectedMetadata extends ExpectedMetadata
> = {
  type: Type
  address: string
  metadata: {
    expected: {
      [K in keyof _ExpectedMetadata]: {
        item: EntityMetadataItem
        typed: NarrowedMetadataTypedValue<_ExpectedMetadata[K]>
      }
    }
    explicit: EntityMetadataItem[]
    all: EntityMetadataItem[]
  }
  auth: AuthInfo
  resources: {
    fungible: {
      address: string
      value: string
      explicitMetadata?: EntityMetadataItem[]
      vaults: FungibleResourcesCollectionItemVaultAggregatedVaultItem[]
    }[]
    nonFungible: {
      address: string
      nbrOfNfts: number
      ids: string[]
      explicitMetadata?: EntityMetadataItem[]
      vaults: NonFungibleResourcesCollectionItemVaultAggregatedVaultItem[]
    }[]
  }
}

export const transformEntity =
  <
    Details extends StateEntityDetailsVaultResponseItem['details'],
    StandardMetadata extends ExpectedMetadata,
    SystemMetadata extends ExpectedMetadata
  >(
    standardMetadata?: StandardMetadata,
    systemMetadata?: SystemMetadata
  ) =>
  <E extends StateEntityDetailsVaultResponseItem>(entity: E) => ({
    address: entity.address,
    details: entity.details as Details,
    metadata: transformMetadata(entity, standardMetadata, systemMetadata),
    auth: getAuthInfo(
      (entity.details as StateEntityDetailsResponseComponentDetails)
        .role_assignments!
    ),
    resources: {
      fungible: entity.fungible_resources.items.map((item) => ({
        address: item.resource_address,

        value:
          item.vaults.items
            .reduce((prev, next) => prev.plus(next.amount), new BigNumber(0))
            .toString() || '0',

        explicitMetadata: item.explicit_metadata?.items,
        vaults: item.vaults.items
      })),

      nonFungible: entity.non_fungible_resources.items.map((item) => ({
        address: item.resource_address,
        nbrOfNfts: item.vaults.items.reduce((sum, vault) => {
          return sum + vault.total_count
        }, 0),

        ids: pipe(
          () => item.vaults.items,
          map(({ items }) => items),
          (items) => reject(isNil, items),
          flatten
        )(),

        explicitMetadata: item.explicit_metadata?.items,
        vaults: item.vaults.items
      }))
    }
  })
