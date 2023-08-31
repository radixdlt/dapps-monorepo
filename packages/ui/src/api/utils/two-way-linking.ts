import type { StateEntityDetailsVaultResponseItem } from '@radixdlt/babylon-gateway-api-sdk'
import { getEntityDetails } from '@api/gateway'
import { getVectorMetadata } from './metadata'

export const getLinkedEntities = async (
  dappDefinition: StateEntityDetailsVaultResponseItem
) => {
  const claimedEntities = getVectorMetadata('claimed_entities')(
    dappDefinition.metadata
  ) as string[]

  const claimedEntityDetails = await getEntityDetails(claimedEntities)

  const linkedEntities: StateEntityDetailsVaultResponseItem[] = []

  for (const claimedEntity of claimedEntityDetails) {
    const linked = (
      getVectorMetadata('dapp_definitions')(claimedEntity.metadata) as string[]
    ).some((address) => address === dappDefinition.address)

    if (linked) linkedEntities.push(claimedEntity)
  }

  return linkedEntities
}

export const getLinkedDappDefinitions = async (
  entity: StateEntityDetailsVaultResponseItem
) => {
  const dappDefinitions = getVectorMetadata('dapp_definitions')(
    entity.metadata
  ) as string[]

  const dappDefinitionDetails = await getEntityDetails(dappDefinitions)

  const linkedDappDefinitions: StateEntityDetailsVaultResponseItem[] = []

  for (const dappDefinition of dappDefinitionDetails) {
    const linked = (
      getVectorMetadata('claimed_entities')(dappDefinition.metadata) as string[]
    ).some((address) => address === dappDefinition.address)

    if (linked) linkedDappDefinitions.push(dappDefinition)
  }

  return linkedDappDefinitions
}
