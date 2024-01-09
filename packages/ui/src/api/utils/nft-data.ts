import type {
  ProgrammaticScryptoSborValue,
  ProgrammaticScryptoSborValueNonFungibleLocalId,
  ProgrammaticScryptoSborValueReference,
  ProgrammaticScryptoSborValueTuple,
  StateNonFungibleDetailsResponseItem
} from '@common/gateway-sdk'

export type ExpectedNftData = {
  [key: string]: ProgrammaticScryptoSborValue['kind']
}

export type NarrowedNftDataTypedValue<
  T extends ProgrammaticScryptoSborValue['kind']
> = Extract<ProgrammaticScryptoSborValue, { kind: T }>

export const createStandardNftData = <T extends ExpectedNftData>(entries: T) =>
  entries as Partial<T>

export const createSystemNftData = <T extends ExpectedNftData>(entries: T) =>
  entries as Required<T>

export const getNftData = (
  data: StateNonFungibleDetailsResponseItem['data'],
  key: string
) =>
  ((data?.programmatic_json as any)?.fields as any[])?.find(
    ({ field_name }) => field_name === key
  )?.value

export const transformNftData = <
  Standard extends ExpectedNftData,
  System extends ExpectedNftData
>(
  data: StateNonFungibleDetailsResponseItem['data'],
  standardEntries: Standard = {} as Standard,
  systemEntries: System = {} as System
) => {
  const isStandardEntry = (value: ProgrammaticScryptoSborValue) =>
    Object.keys(standardEntries).some((key) => value.field_name === key)

  const isSystemEntry = (value: ProgrammaticScryptoSborValue) =>
    Object.keys(systemEntries).some((key) => value.field_name === key)

  const validateStandardEntryType = (value: ProgrammaticScryptoSborValue) => {
    const expectedType =
      standardEntries[
        Object.keys(standardEntries).find((key) => value.field_name === key)!
      ]
    const actualType = value.kind

    return expectedType === actualType
  }

  const expected = {} as {
    [K in keyof typeof standardEntries]: NarrowedNftDataTypedValue<
      (typeof standardEntries)[K]
    >
  } & {
    [K in keyof typeof systemEntries]: NarrowedNftDataTypedValue<
      (typeof systemEntries)[K]
    >
  }

  const nonStandard: ProgrammaticScryptoSborValue[] = []

  const programmatic_json = data?.programmatic_json

  if (programmatic_json && programmatic_json.kind === 'Tuple') {
    for (let field of programmatic_json.fields) {
      if (field.field_name) {
        if (
          (isStandardEntry(field) && validateStandardEntryType(field)) ||
          isSystemEntry(field)
        ) {
          // @ts-ignore
          expected[field.field_name] = field
        } else {
          nonStandard.push(field)
        }
      }
    }
  }

  return {
    expected,
    nonStandard,
    all: { ...expected, ...nonStandard }
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
