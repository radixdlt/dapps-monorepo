import { getAuthInfo, type AuthInfo } from '../auth'
import {
  transformMetadata,
  type KnownStandardTypes,
  type MetadataTypeToNativeType
} from '../metadata'
import type { Component } from './component'
import type { Package } from './package'
import type { Pool } from './pool'
import type { PoolUnit } from './pool-unit'
import type { Resource } from './resource'
import type { StakeUnit } from './stake-unit'
import type { Validator } from './validator'
import type {
  EntityMetadataItem,
  StateEntityDetailsResponseComponentDetails,
  StateEntityDetailsVaultResponseItem
} from '@common/gateway-sdk'
import type { EntityType } from '@common/ret'

export type Entity =
  | Package
  | Validator
  | Resource
  | PoolUnit
  | Pool
  | Component
  | StakeUnit

export type _Entity<
  Type extends string,
  StandardMetadata extends (keyof KnownStandardTypes)[],
  HasAuth = true
> = {
  type: Type
  address: string
  metadata: {
    standard: Partial<
      {
        [K in StandardMetadata[number]]: {
          item: EntityMetadataItem
          value: MetadataTypeToNativeType[KnownStandardTypes[K]]
        }
      } & {
        tags: {
          item: EntityMetadataItem
          value: MetadataTypeToNativeType[KnownStandardTypes['tags']]
        }
      }
    >
    nonStandard: EntityMetadataItem[]
    explicit: EntityMetadataItem[]
    all: EntityMetadataItem[]
  }
} & (HasAuth extends true ? { auth: AuthInfo } : {})

export const transformEntity =
  (standardMetadata: (keyof KnownStandardTypes)[]) =>
  <
    E extends {
      address: string
      metadata: StateEntityDetailsVaultResponseItem['metadata']
      details?: StateEntityDetailsVaultResponseItem['details']
      entityType?: EntityType
    }
  >(
    entity: E
  ) => ({
    address: entity.address,
    entity,
    entityType: entity.entityType,
    metadata: transformMetadata(entity, standardMetadata),
    auth: (entity.details as StateEntityDetailsResponseComponentDetails)
      .role_assignments
      ? getAuthInfo(
          (entity.details as StateEntityDetailsResponseComponentDetails)
            .role_assignments!
        )
      : (undefined as unknown as AuthInfo)
  })
