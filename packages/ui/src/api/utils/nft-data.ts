import type {
  MetadataStringValueTypeEnum,
  MetadataTypedValue,
  MetadataUrlValueTypeEnum,
  StateNonFungibleDetailsResponseItem
} from '@radixdlt/babylon-gateway-api-sdk'
import type { MetadataTypeToNativeType } from './metadata'

export type NftDataItem<N extends keyof KnownStandardTypes | string = string> =
  {
    kind: MetadataTypedValue['type']
    field_name: N
    value: N extends keyof KnownStandardTypes
      ? MetadataTypeToNativeType[KnownStandardTypes[N]]
      : unknown
    type_name?: string
  }

export type KnownStandardTypes = {
  name: MetadataStringValueTypeEnum
  description: MetadataStringValueTypeEnum
  key_image_url: MetadataUrlValueTypeEnum
  claim_amount: MetadataStringValueTypeEnum
  claim_epoch: MetadataStringValueTypeEnum
}

export const getNftData = (
  data: StateNonFungibleDetailsResponseItem['data'],
  key: string
) =>
  ((data?.programmatic_json as any).fields as any[]).find(
    ({ field_name }) => field_name === key
  )?.value

const isStandardEntry = <T extends (keyof KnownStandardTypes)[]>(
  standard: T,
  item: NftDataItem
): item is NftDataItem<T[number]> => {
  const fieldName = standard.find((key) => item.field_name === key)!
  if (fieldName) return true
  return false
}

export const transformNftData = <T extends (keyof KnownStandardTypes)[]>(
  data: StateNonFungibleDetailsResponseItem['data'],
  standardEntries: T
) => {
  const standard = {} as { [K in T[number]]: NftDataItem<K> }
  const nonStandard: NftDataItem[] = []

  for (let field of (data?.programmatic_json as any).fields as NftDataItem[]) {
    if (isStandardEntry(standardEntries, field)) {
      standard[field.field_name] = field
    } else {
      nonStandard.push(field)
    }
  }

  return {
    standard,
    nonStandard,
    all: [...Object.values(standard), ...nonStandard]
  }
}
