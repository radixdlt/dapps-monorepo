import type { EntityMetadataItem } from '@radixdlt/babylon-gateway-api-sdk'

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
