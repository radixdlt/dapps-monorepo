import type {
  ProgrammaticScryptoSborValue,
  ProgrammaticScryptoSborValueDecimal,
  ProgrammaticScryptoSborValueNonFungibleLocalId,
  ProgrammaticScryptoSborValueReference,
  ProgrammaticScryptoSborValueString,
  ProgrammaticScryptoSborValueTuple,
  ProgrammaticScryptoSborValueU64,
  StateNonFungibleDetailsResponseItem
} from '@common/gateway-sdk'
import { add } from 'ramda'

export type NftDataItem<N extends keyof KnownStandardTypes | string = string> =
  N extends keyof KnownStandardTypes
    ? KnownStandardTypes[N]
    : ProgrammaticScryptoSborValue

export type KnownStandardTypes = {
  name: ProgrammaticScryptoSborValueString
  description: ProgrammaticScryptoSborValueString
  key_image_url: ProgrammaticScryptoSborValueString
  claim_amount: ProgrammaticScryptoSborValueDecimal
  claim_epoch: ProgrammaticScryptoSborValueU64
}

export const getNftData = (
  data: StateNonFungibleDetailsResponseItem['data'],
  key: string
) =>
  ((data?.programmatic_json as any)?.fields as any[])?.find(
    ({ field_name }) => field_name === key
  )?.value

const isStandardEntry = <T extends (keyof KnownStandardTypes)[]>(
  standard: T,
  item: ProgrammaticScryptoSborValue
): item is KnownStandardTypes[T[number]] => {
  const fieldName = standard.find((key) => item.field_name === key)
  if (fieldName) return true
  return false
}

export const transformNftData = <T extends (keyof KnownStandardTypes)[]>(
  data: StateNonFungibleDetailsResponseItem['data'],
  standardEntries: T
) => {
  const standard = {} as { [K in T[number]]: KnownStandardTypes[K] }
  const nonStandard: ProgrammaticScryptoSborValue[] = []

  const programmatic_json = data?.programmatic_json

  if (programmatic_json && programmatic_json.kind === 'Tuple') {
    for (let field of programmatic_json.fields) {
      if (field.field_name) {
        if (isStandardEntry(standardEntries, field)) {
          const key = field.field_name as T[number]
          standard[key] = field
        } else {
          nonStandard.push(field)
        }
      }
    }
  }

  return {
    standard,
    nonStandard,
    all: [...Object.values(standard), ...nonStandard]
  }
}

export const transformTupleGlobalIdToAddress = (
  data: ProgrammaticScryptoSborValueTuple
): string => {
  if (data.type_name !== 'NonFungibleGlobalId') {
    return ''
  }

  const address = data.fields.find(
    ({ field_name, kind }) =>
      field_name === 'resource_address' && kind === 'Reference'
  ) as ProgrammaticScryptoSborValueReference

  const localId = data.fields.find(
    ({ field_name, kind }) =>
      field_name === 'local_id' && kind === 'NonFungibleLocalId'
  ) as ProgrammaticScryptoSborValueNonFungibleLocalId

  if (address && localId) {
    return `${address.value}:${localId.value}`
  }
  return ''
}
