import type { KnownStandardTypes, MetadataTypeToNativeType } from '../metadata'
import type { Component } from './component'
import type { Package } from './package'
import type { Pool } from './pool'
import type { PoolUnit } from './pool-unit'
import type { Resource } from './resource'
import type { StakeUnit } from './stake-unit'
import type { Validator } from './validator'
import type { EntityMetadataItem } from '@common/gateway-sdk'

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
  StandardMetadata extends (keyof KnownStandardTypes)[]
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
}
