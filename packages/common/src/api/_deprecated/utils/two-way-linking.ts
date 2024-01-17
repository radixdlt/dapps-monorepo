import type {
  EntityMetadataCollection,
  StateEntityDetailsVaultResponseItem
} from '@common/utils/gateway-sdk'
import { getStringMetadata, getVectorMetadata } from './metadata'
import { callApi } from '@common/api/gateway'

const getDappDefinitions = (metadata: EntityMetadataCollection) => {
  let dappDefinitions: string[] = []

  const dappDefinition = getStringMetadata('dapp_definition')(metadata)

  if (dappDefinition !== '' || dappDefinition !== undefined)
    dappDefinitions.push(dappDefinition)

  const dappDefinitionsVector = getVectorMetadata('dapp_definitions')(metadata)

  if (dappDefinitionsVector.length > 0 || dappDefinitionsVector !== undefined)
    dappDefinitions.push(...dappDefinitionsVector)

  return dappDefinitions
}

export const getLinkedEntities = async (
  dappDefinition: StateEntityDetailsVaultResponseItem
) => {
  const claimedEntities = getVectorMetadata('claimed_entities')(
    dappDefinition.metadata
  ) as string[]

  const claimedEntityDetails = await callApi(
    'getEntityDetailsVaultAggregated',
    claimedEntities
  )

  if (claimedEntityDetails.isErr()) return []

  const linkedEntities: StateEntityDetailsVaultResponseItem[] = []

  for (const claimedEntity of claimedEntityDetails.value) {
    const dappDefinitions = getDappDefinitions(claimedEntity.metadata)

    const linked = dappDefinitions.some(
      (address) => address === dappDefinition.address
    )

    if (linked) linkedEntities.push(claimedEntity)
  }

  return linkedEntities
}

export const getLinkedDappDefinitions = async (
  entity: StateEntityDetailsVaultResponseItem
) => {
  const dappDefinitions = getDappDefinitions(entity.metadata)

  const dappDefinitionDetails = await callApi(
    'getEntityDetailsVaultAggregated',
    dappDefinitions
  )

  if (dappDefinitionDetails.isErr()) return []

  const linkedDappDefinitions: StateEntityDetailsVaultResponseItem[] = []

  for (const dappDefinition of dappDefinitionDetails.value) {
    const linked = (
      getVectorMetadata('claimed_entities')(dappDefinition.metadata) as string[]
    ).some((address) => address === entity.address)

    if (linked) linkedDappDefinitions.push(dappDefinition)
  }

  return linkedDappDefinitions
}
