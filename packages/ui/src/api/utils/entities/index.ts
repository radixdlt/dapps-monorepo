import type { Package } from './package'
import type { Pool } from './pool'
import type { PoolUnit } from './pool-unit'
import type { Resource } from './resource'
import type { Validator } from './validator'
import type { EntityMetadataItem } from '@radixdlt/babylon-gateway-api-sdk'

export type Entity = Package | Validator | Resource | PoolUnit | Pool

export type _Entity<StandardMetadata extends [name: string, value: unknown][]> =
  {
    address: string
    metadata: {
      standard: Partial<{
        [K in StandardMetadata[number] as K[0]]: {
          item: EntityMetadataItem
          value: K[1]
        }
      }>
      nonStandard: EntityMetadataItem[]
      explicit: EntityMetadataItem[]
      all: EntityMetadataItem[]
    }
  }
