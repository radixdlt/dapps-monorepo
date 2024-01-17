import type {
  EntityMetadataItem,
  MetadataTypedValue
} from '@common/utils/gateway-sdk'

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
