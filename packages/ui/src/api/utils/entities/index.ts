import type { Component } from './component'
import type { Package } from './package'
import type { Pool } from './pool'
import type { PoolUnit } from './pool-unit'
import type { Resource } from './resource'
import type { StakeUnit } from './stake-unit'
import type { Validator } from './validator'
import type { EntityMetadataItem } from '@radixdlt/babylon-gateway-api-sdk'

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
  StandardMetadata extends [name: string, value: unknown][]
> = {
  type: Type
  address: string
  metadata: {
    standard: Partial<
      {
        [K in StandardMetadata[number] as K[0]]: {
          item: EntityMetadataItem
          value: K[1]
        }
      } & {
        tags: {
          item: EntityMetadataItem
          value: string[]
        }
      }
    >
    nonStandard: EntityMetadataItem[]
    explicit: EntityMetadataItem[]
    all: EntityMetadataItem[]
  }
}
