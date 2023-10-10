import type {
  EntityMetadataItem,
  MetadataTypedValue
} from '@common/gateway-sdk'

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
