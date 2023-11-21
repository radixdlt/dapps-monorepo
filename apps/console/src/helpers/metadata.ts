export const MetadataType = {
  String: 'Metadata::String',
  StringArray: 'Metadata::StringArray',
  Address: 'Metadata::Address',
  AddressArray: 'Metadata::AddressArray',
  Url: 'Metadata::Url'
} as const

export const AuthRoleType = {
  None: 'None',
  AllowAll: 'AccessRule::AllowAll',
  DenyAll: 'AccessRule::DenyAll'
} as const

export const stringMetadata = (
  key: string,
  value: string,
  locked: boolean
) => `"${key}" => Tuple(
      Some(Enum<${MetadataType.String}>("${value}")),                  
      ${locked}                                                         
  )`

export const stringArrayMetadata = (
  key: string,
  value: string[],
  locked: boolean
) => {
  const items = value.map((item) => `"${item}"`).join(', ')

  return `"${key}" => Tuple(
            Some(Enum<${MetadataType.StringArray}>(Array<String>(${items}))),                  
            ${locked}                                                         
      )`
}

export const addressMetadata = (
  key: string,
  value: string,
  locked: boolean
) => `"${key}" => Tuple(
        Some(Enum<${MetadataType.Address}>("${value}")),                  
        ${locked}                                                         
  )`

export const urlMetadata = (
  key: string,
  value: string,
  locked: boolean
) => `"${key}" => Tuple(
          Some(Enum<${MetadataType.Url}>("${value}")),                  
          ${locked}                                                         
    )`

export const addressArrayMetadata = (
  key: string,
  value: string[],
  locked: boolean
) => {
  const addresses = value.map((address) => `Address("${address}")`).join(', ')

  return `"${key}" => Tuple(
          Some(Enum<${MetadataType.AddressArray}>(Array<Address>(${addresses}))),                  
          ${locked}                                                         
    )`
}
