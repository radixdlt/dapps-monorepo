import { getStringMetadata } from '@api/utils/metadata'
import type { StateEntityDetailsVaultResponseItem } from '@radixdlt/babylon-gateway-api-sdk'

export const getDappDefinitionData = ({
  metadata,
  address
}: StateEntityDetailsVaultResponseItem) => ({
  address,
  name: getStringMetadata('name')(metadata),
  iconUrl: getStringMetadata('icon_url')(metadata)
})
