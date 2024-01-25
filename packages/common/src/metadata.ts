import type { MetadataTypedValue } from './gateway-sdk'

export const typedMetadataToString = (metadata: MetadataTypedValue): string => {
  if (metadata.type === 'Bool') {
    return metadata.value ? 'true' : ''
  }

  if (
    metadata.type === 'BoolArray' ||
    metadata.type === 'DecimalArray' ||
    metadata.type === 'GlobalAddressArray' ||
    metadata.type === 'I32Array' ||
    metadata.type === 'I64Array' ||
    metadata.type === 'InstantArray' ||
    metadata.type === 'NonFungibleLocalIdArray' ||
    metadata.type === 'OriginArray' ||
    metadata.type === 'U32Array' ||
    metadata.type === 'U64Array' ||
    metadata.type === 'UrlArray' ||
    metadata.type === 'StringArray'
  ) {
    return metadata.values.join(', ')
  }

  if (metadata.type === 'U8Array') {
    return metadata.value_hex
  }

  if (
    metadata.type === 'Decimal' ||
    metadata.type === 'GlobalAddress' ||
    metadata.type === 'I32' ||
    metadata.type === 'I64' ||
    metadata.type === 'Instant' ||
    metadata.type === 'NonFungibleLocalId' ||
    metadata.type === 'String' ||
    metadata.type === 'U32' ||
    metadata.type === 'U64' ||
    metadata.type === 'U8' ||
    metadata.type === 'Url' ||
    metadata.type === 'Origin'
  ) {
    return metadata.value
  }

  if (metadata.type === 'NonFungibleGlobalId') {
    return `${metadata.resource_address}:${metadata.non_fungible_id}`
  }

  if (metadata.type === 'NonFungibleGlobalIdArray') {
    return metadata.values
      .map((value) => `${value.resource_address}:${value.non_fungible_id}`)
      .join(', ')
  }

  if (metadata.type === 'PublicKey') {
    return `${metadata.value.key_type}(${metadata.value.key_hex})`
  }

  if (metadata.type === 'PublicKeyArray') {
    return metadata.values
      .map((value) => `${value.key_type}(${value.key_hex})`)
      .join(', ')
  }

  return ''
}

export const setStringMetaData = (
  address: string,
  key: string,
  value: string
) => `
    SET_METADATA 
      Address("${address}")
      "${key}"
      Enum<Metadata::String>("${value}")
    ;
  `

export const setUrlMetaData = (address: string, key: string, value: string) => `
    SET_METADATA 
      Address("${address}")
      "${key}"
      Enum<Metadata::Url>("${value}")
    ;
  `

export const setAddressMetaData = (
  address: string,
  key: string,
  value: string
) => `SET_METADATA
          Address("${address}")
          "${key}"
          Enum<Metadata::Address>(Address("${value}"))
        ;
        `

export const setStringArrayMetaData = (
  address: string,
  key: string,
  value: string[]
) => `
    SET_METADATA 
      Address("${address}")
      "${key}"
      Enum<Metadata::StringArray>(
        Array<String>(${value.map((v) => `"${v}"`).join(', ')})
      )
    ;
  `

export const setAddressArrayMetaData = (
  address: string,
  key: string,
  value: string[]
) => `
    SET_METADATA 
      Address("${address}")
      "${key}"
      Enum<Metadata::AddressArray>(
        Array<Address>(${value.map((val) => `Address("${val}")`).join(', ')})
      )
    ;
  `

export const setOriginArrayMetaData = (
  address: string,
  key: string,
  value: string[]
) => `
  SET_METADATA 
      Address("${address}")
      "${key}"
      Enum<Metadata::OriginArray>(
        Array<String>(${value.map((origin) => `"${origin}"`).join(', ')})
      )
    ;
`
export const removeMetadata = (address: string, key: string) => `
    REMOVE_METADATA
      Address("${address}")
      "${key}"
    ;
  `

export const metadataManifestPartials = {
  setStringMetaData,
  setUrlMetaData,
  setAddressMetaData,
  setStringArrayMetaData,
  setAddressArrayMetaData,
  removeMetadata
}
