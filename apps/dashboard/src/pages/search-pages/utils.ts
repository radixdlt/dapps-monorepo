import type {
  EntityMetadataItem,
  MetadataTypedValue
} from '@radixdlt/babylon-gateway-api-sdk'

export const metadataItem = (
  key: string,
  value: any,
  type: MetadataTypedValue['type']
) =>
  ({
    key,
    value: {
      typed: {
        type,
        value
      }
    }
  } as EntityMetadataItem)
