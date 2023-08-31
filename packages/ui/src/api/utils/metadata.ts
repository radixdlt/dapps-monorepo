import type {
  EntityMetadataCollection,
  EntityMetadataItem
} from '@radixdlt/babylon-gateway-api-sdk'

export const getEnumStringMetadata =
  (key: string) => (metadata?: EntityMetadataCollection) =>
    (
      metadata?.items.find((item) => item.key === key)?.value
        ?.programmatic_json as any
    )?.fields?.[0].value || ''

export const getStringMetadata =
  (key: string) =>
  (metadata?: EntityMetadataCollection): string =>
    (metadata?.items.find((item) => item.key === key)?.value?.typed as any)
      ?.value || ''

export const getVectorMetadata =
  (key: string) =>
  (metadata?: EntityMetadataCollection): any[] =>
    (metadata?.items.find((item) => item.key === key)?.value.typed as any)
      ?.values || []
