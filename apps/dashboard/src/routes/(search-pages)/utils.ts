import { getStringMetadata } from '@api/utils/metadata'
import { getLinkedDappDefinitions } from '@api/utils/two-way-linking'
import type { StateEntityDetailsVaultResponseItem } from '@common/gateway-sdk'
import { map } from 'ramda'

export const getDappDefinitionData = ({
  metadata,
  address
}: StateEntityDetailsVaultResponseItem) => ({
  address,
  name: getStringMetadata('name')(metadata),
  iconUrl: getStringMetadata('icon_url')(metadata)
})

export const getAssociatedDapps = (
  entity: Promise<StateEntityDetailsVaultResponseItem>
) => entity.then(getLinkedDappDefinitions).then(map(getDappDefinitionData))
