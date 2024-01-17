import type {
  EntityMetadataCollection,
  EntityMetadataItem,
  MetadataTypedValue,
  StateEntityDetailsVaultResponseItem
} from '@common/utils/gateway-sdk'
import { isNil, pipe } from 'ramda'
import sanitizeHtml from 'sanitize-html'

export type NarrowedMetadataTypedValue<T extends MetadataTypedValue['type']> =
  Extract<MetadataTypedValue, { type: T }>

export type ExpectedMetadata = { [key: string]: MetadataTypedValue['type'] }

export const createStandardMetadata = <T extends ExpectedMetadata>(
  entries: T
) => entries as Partial<T>
export const createSystemMetadata = <T extends ExpectedMetadata>(entries: T) =>
  entries as Required<T>

export type SystemMetadata = { [key: string]: MetadataTypedValue['type'] }

export const getMetadataItem =
  (key: string) => (metadata?: EntityMetadataCollection) =>
    metadata?.items.find((item) => item.key === key)

export const getEnumStringMetadataValue = (item: EntityMetadataItem): string =>
  (item?.value?.programmatic_json as any)?.fields?.[0].value || ''

export const getStringMetadataValue = (item: EntityMetadataItem): string =>
  (item?.value?.typed as any)?.value || ''

export const getVectorMetadataValue = (item: EntityMetadataItem): string[] =>
  (item?.value.typed as any)?.values || []

export const getEnumStringMetadata = (key: string) =>
  pipe(
    (metadata: EntityMetadataCollection) => getMetadataItem(key)(metadata),
    (item) => (isNil(item) ? '' : getStringMetadataValue(item)),
    sanitizeHtml
  )

export const getStringMetadata = (key: string) =>
  pipe(
    (metadata: EntityMetadataCollection) => getMetadataItem(key)(metadata),
    (item) => (isNil(item) ? '' : getStringMetadataValue(item)),
    sanitizeHtml
  )

export const ensureMetadataType = (key: string, type: string) =>
  pipe(
    (metadata: EntityMetadataCollection) => getMetadataItem(key)(metadata),
    (item) => (isNil(item) ? [] : getVectorMetadataValue(item))
  )

export const getVectorMetadata = (key: string) =>
  pipe(
    (metadata: EntityMetadataCollection) => getMetadataItem(key)(metadata),
    (item) => (isNil(item) ? [] : getVectorMetadataValue(item)),
    (items) => items.map((value) => sanitizeHtml(value))
  )

export const standardMetadata = createStandardMetadata({
  name: 'String',
  description: 'String',
  tags: 'StringArray',
  symbol: 'String',
  icon_url: 'Url'
})

export const transformMetadata = <
  Standard extends ExpectedMetadata,
  System extends ExpectedMetadata
>(
  metadata: {
    metadata: StateEntityDetailsVaultResponseItem['metadata']
    explicit_metadata?: StateEntityDetailsVaultResponseItem['explicit_metadata']
  },
  standardEntries: Standard = {} as Standard,
  systemEntries: System = {} as System
) => {
  const isStandardEntry = (item: EntityMetadataItem) =>
    Object.keys(standardEntries).some((key) => item.key === key)
  const isSystemEntry = (item: EntityMetadataItem) =>
    Object.keys(systemEntries).some((key) => item.key === key)

  const validateStandardEntryType = (item: EntityMetadataItem) => {
    const expectedType =
      standardEntries[
        Object.keys(standardEntries).find((key) => item.key === key)!
      ]
    const actualType = item.value.typed.type

    return expectedType === actualType
  }

  const expected = {} as {
    [K in keyof typeof standardEntries]: {
      item: EntityMetadataItem
      typed: NarrowedMetadataTypedValue<(typeof standardEntries)[K]>
    }
  } & {
    [K in keyof typeof systemEntries]: {
      item: EntityMetadataItem
      typed: NarrowedMetadataTypedValue<(typeof systemEntries)[K]>
    }
  }

  const explicit = metadata.explicit_metadata?.items ?? []

  for (const item of metadata.metadata?.items) {
    if (
      (isStandardEntry(item) && validateStandardEntryType(item)) ||
      isSystemEntry(item)
    ) {
      // @ts-ignore
      expected[item.key as keyof typeof expected] = {
        item,
        typed: item.value.typed
      }
    }
  }

  return {
    expected,
    explicit,
    all: metadata.metadata?.items ?? []
  }
}
