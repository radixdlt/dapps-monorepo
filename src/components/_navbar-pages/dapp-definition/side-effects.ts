import { getEntitiesDetails } from '@api/gateway'
import {
  getStringMetadata,
  getPopulatedResources,
  getVectorMetadata
} from '@api/utils/resources'
import type { StateEntityDetailsResponseItem } from '@radixdlt/babylon-gateway-api-sdk'
import type { Account } from '@stores'

export type FormattedAccount = Awaited<
  ReturnType<typeof getFormattedAccounts>
>[number]

const hasDAppDefinitionMetadata = (entity?: StateEntityDetailsResponseItem) =>
  !!entity?.metadata.items.find(
    (item) =>
      item.key === 'account_type' && item.value.as_string === 'dapp definition'
  )

export const getFormattedAccounts = async (accounts: Account[]) => {
  const accountOverviews = await getEntitiesDetails(
    accounts.map((acc) => acc.address)
  )
  const overviews = accountOverviews.items.reduce((prev, next) => {
    prev[next.address] = next
    return prev
  }, {} as Record<string, StateEntityDetailsResponseItem>)

  return Promise.all(
    accounts.map(async ({ address, label }) => {
      const isDApp = hasDAppDefinitionMetadata(overviews[address])
      const metadata = overviews[address]?.metadata
      return {
        label: `${label}${isDApp ? ' - dApp definition' : ''}`,
        address,
        dappDefinition: isDApp,
        resources: await getPopulatedResources(address),
        name: getStringMetadata('name')(metadata),
        description: getStringMetadata('description')(metadata),
        domain: getStringMetadata('domain')(metadata),
        claimedWebsites: getVectorMetadata('claimed_websites')(metadata),
        claimedEntities: getVectorMetadata('claimed_entities')(metadata)
      }
    })
  )
}
