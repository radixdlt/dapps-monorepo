import type {
  EntityMetadataCollection,
  EntityMetadataItem,
  MetadataGlobalAddressValueTypeEnum,
  MetadataStringArrayValueTypeEnum,
  MetadataStringValueTypeEnum,
  MetadataTypedValue,
  MetadataUrlValueTypeEnum,
  StateEntityDetailsVaultResponseItem
} from '@common/gateway-sdk'
import { isNil, pipe } from 'ramda'
import sanitizeHtml from 'sanitize-html'

export type MetadataTypeToNativeType = {
  [MetadataStringValueTypeEnum.String]: string
  [MetadataUrlValueTypeEnum.Url]: URL
  [MetadataStringArrayValueTypeEnum.StringArray]: string[]
  [MetadataGlobalAddressValueTypeEnum.GlobalAddress]: string
}

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

const getValue = (typedValue: MetadataTypedValue) => {
  if ('values' in typedValue) {
    return typedValue.values
  } else if ('value' in typedValue) {
    if (typedValue.type === 'Url') {
      return new URL(typedValue.value)
    }
    return typedValue.value
  } else {
    throw Error('Unexpected metadata structure')
  }
}

const isStandardEntry = <
  StandardMetadata extends { [key in MetadataKey]: unknown },
  MetadataKey extends string | number | symbol = keyof StandardMetadata
>(
  standard: MetadataKey[],
  item: EntityMetadataItem
): item is EntityMetadataItem & { key: typeof key } => {
  const key = standard.find((key) => item.key === key)!
  if (key) return true
  return false
}

export const transformMetadata = <
  ExpectedMetadata extends { [key in MetadataKey]: MetadataValue },
  MetadataKey extends string | number | symbol = keyof ExpectedMetadata,
  MetadataValue = ExpectedMetadata[MetadataKey]
>(
  metadata: {
    metadata: StateEntityDetailsVaultResponseItem['metadata']
    explicit_metadata?: StateEntityDetailsVaultResponseItem['explicit_metadata']
  },
  standardEntries: MetadataKey[]
) => {
  let expected = {} as {
    [K in MetadataKey]: {
      item: EntityMetadataItem
      value: ExpectedMetadata[K]
    }
  }

  const explicit: EntityMetadataItem[] = metadata.explicit_metadata?.items ?? []

  for (const item of metadata.metadata?.items) {
    if (isStandardEntry(standardEntries, item)) {
      let value = getValue(
        item.value.typed
      ) as (typeof expected)[typeof item.key]['value']
      // @ts-ignore
      expected[item.key] = {
        item,
        value
      }
    }
  }

  return {
    expected,
    explicit,
    nonStandard:
      metadata.metadata?.items.filter(
        (item) => !standardEntries.includes(item.key as MetadataKey)
      ) ?? [],
    all: metadata.metadata?.items ?? []
  }
}
